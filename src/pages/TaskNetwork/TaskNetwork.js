import React, { useMemo, useEffect, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { selectGroups, fetchGroups, setNodePositions, resetNodePositions } from '../../redux/slices/groups';
import dagre from 'dagre';
import TaskNetworkInner from '../../components/TaskNetworkInner/TaskNetworkInner';
import { calculateTimings } from '../../utils/ganttUtils';
import styles from '../../pages/TaskNetwork/TaskNetwork.module.css';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

const createDagreGraph = () => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));
    return graph;
};

const getLayoutedElementsForGroup = (nodes, edges) => {
    const dagreGraph = createDagreGraph();
    dagreGraph.setGraph({ 
        rankdir: 'LR',
        nodesep: 100,
        ranksep: 150,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 200, height: 120 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    const nodesWithoutEdges = nodes.filter(
        (node) => !edges.some((edge) => edge.source === node.id || edge.target === node.id)
    );

    for (let i = 0; i < nodesWithoutEdges.length - 1; i++) {
        dagreGraph.setEdge(nodesWithoutEdges[i].id, nodesWithoutEdges[i + 1].id, { style: 'invis' });
    }

    if (nodesWithoutEdges.length > 0 && nodes.length > nodesWithoutEdges.length) {
        const firstNodeWithEdges = nodes.find((node) =>
            edges.some((edge) => edge.source === node.id || edge.target === node.id)
        );
        if (firstNodeWithEdges) {
            dagreGraph.setEdge(firstNodeWithEdges.id, nodesWithoutEdges[0].id, { style: 'invis' });
        }
    }

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 100,
                y: nodeWithPosition.y - 60,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

const TaskNetwork = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch();
    const { groups, nodePositions } = useSelector(selectGroups);
    const [ganttData, setGanttData] = useState([]);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const initialData = useMemo(() => {
        if (!groups.items || !groups.items.length) {
            return {
                initialNodes: [
                    {
                        id: 'no-tasks',
                        type: 'customNode',
                        data: { label: 'Додайте задачі для відображення графіка' },
                        position: { x: 100, y: 100 },
                        className: styles.node,
                    }
                ],
                initialEdges: [],
                handleResetPositions: () => dispatch(resetNodePositions()),
            };
        }

        let allNodes = [];
        let allEdges = [];
        let allTasksWithTimings = [];
        let groupOffsetY = 0;

        groups.items.forEach((group) => {
            const groupNodes = [];
            const groupEdges = [];

            const tasksWithTimings = calculateTimings(group.tasks || [], group.createdAt).map(task => ({
                ...task,
                groupId: group._id,
                members: group.members || [],
            }));

            tasksWithTimings.forEach((task) => {
                const savedPosition = nodePositions[task._id] || { x: 0, y: 0 };
                const nodeClass = task.deadlineMissed
                    ? `${styles.node} ${styles.nodeMissedDeadline}`
                    : task.priority
                    ? `${styles.node} ${styles.nodePriority}`
                    : `${styles.node} ${styles.nodeNormal}`;

                groupNodes.push({
                    id: task._id,
                    type: 'customNode',
                    data: {
                        label: (
                            <div>
                                <strong>{task.title} ({group.title})</strong><br />
                                Тривалість: {task.duration} дн.<br />
                                <div className={styles.termsWrapper}>
                                    <span className={styles.earlyTermMarker}></span>
                                    {task.earliestStartDate.toLocaleDateString()} – {task.earliestFinishDate.toLocaleDateString()}
                                </div>
                                <div className={styles.termsWrapper}>
                                    <span className={styles.lateTermMarker}></span>
                                    {task.latestStartDate.toLocaleDateString()} – {task.latestFinishDate.toLocaleDateString()}
                                </div>
                            </div>
                        ),
                    },
                    position: savedPosition,
                    className: nodeClass,
                });

                if (task.dependencies && task.dependencies.length > 0) {
                    task.dependencies.forEach((depId) => {
                        groupEdges.push({
                            id: `e-${depId}-${task._id}`,
                            source: depId,
                            target: task._id,
                            animated: true,
                            style: { stroke: '#777', strokeWidth: 2 },
                        });
                    });
                }
            });

            const endTasks = groupNodes.filter(
                (node) => !groupEdges.some((edge) => edge.source === node.id)
            );

            if (groupNodes.length > 0) {
                const endNodeId = `end-${group._id}`;
                groupNodes.push({
                    id: endNodeId,
                    type: 'customNode',
                    data: {
                        label: (
                            <div>
                                <strong>Кінець ({group.title})</strong>
                            </div>
                        ),
                    },
                    position: { x: 0, y: 0 },
                    className: `${styles.node} ${styles.nodeEnd}`,
                });

                endTasks.forEach((task) => {
                    groupEdges.push({
                        id: `e-${task.id}-${endNodeId}`,
                        source: task.id,
                        target: endNodeId,
                        animated: false,
                        style: { stroke: '#777', strokeWidth: 2 },
                    });
                });
            }

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElementsForGroup(groupNodes, groupEdges);

            const maxY = Math.max(...layoutedNodes.map(node => node.position.y), 0);
            const groupHeight = maxY + 50;

            const offsetNodes = layoutedNodes.map(node => {
                const savedPosition = nodePositions[node.id];
                if (savedPosition) {
                    return { ...node, position: savedPosition };
                }
                return {
                    ...node,
                    position: {
                        x: node.position.x,
                        y: node.position.y + groupOffsetY,
                    },
                };
            });

            allNodes = [...allNodes, ...offsetNodes];
            allEdges = [...allEdges, ...layoutedEdges];
            allTasksWithTimings = [...allTasksWithTimings, ...tasksWithTimings];

            groupOffsetY += groupHeight + 150;
        });

        setGanttData(allTasksWithTimings);

        return { 
            initialNodes: allNodes, 
            initialEdges: allEdges, 
            handleResetPositions: () => dispatch(resetNodePositions()) 
        };
    }, [groups, nodePositions, dispatch]);

    const handleNodesChange = (changes) => {
        const positionUpdates = {};
        changes.forEach(change => {
            if (change.type === 'position' && change.position) {
                positionUpdates[change.id] = change.position;
            }
        });
        if (Object.keys(positionUpdates).length > 0) {
            dispatch(setNodePositions(positionUpdates));
        }
    };

    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    
    return (
        <ReactFlowProvider>
            <TaskNetworkInner 
                initialData={initialData} 
                onNodesChangeHandler={handleNodesChange} 
                ganttData={ganttData} 
                groups={groups.items}
            />
        </ReactFlowProvider>
    );
};

export default TaskNetwork;
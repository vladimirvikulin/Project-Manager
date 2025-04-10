import React, { useMemo, useEffect, useState } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    ReactFlowProvider, 
    useNodesState, 
    useEdgesState
} from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { selectGroups, fetchGroups, setNodePositions, resetNodePositions } from '../../redux/slices/groups';
import { Link } from 'react-router-dom';
import MyButton from '../../components/ui/button/MyButton';
import dagre from 'dagre';
import styles from './TaskNetwork.module.css';
import 'reactflow/dist/style.css';

const createDagreGraph = () => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));
    return graph;
};

const getLayoutedElementsForGroup = (nodes, edges) => {
    const dagreGraph = createDagreGraph();
    dagreGraph.setGraph({ 
        rankdir: 'TB', 
        nodesep: 100,
        ranksep: 150,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 150, height: 50 });
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
                x: nodeWithPosition.x - 75,
                y: nodeWithPosition.y - 25,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

const TaskNetworkInner = ({ initialData, onNodesChangeHandler }) => {
    const [isInteractive, setIsInteractive] = useState(true);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.initialEdges);

    useEffect(() => {
        setNodes(initialData.initialNodes);
        setEdges(initialData.initialEdges);
    }, [initialData, setNodes, setEdges]);

    const handleInteractToggle = () => {
        setIsInteractive((prev) => !prev);
    };

    const handleNodesChange = (changes) => {
        onNodesChange(changes);
        onNodesChangeHandler(changes);
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonWrapper}>
                <Link to="/" className={styles.backLink}>
                    <MyButton>Список</MyButton>
                </Link>
                <MyButton onClick={initialData.handleResetPositions}>Скинути позиції</MyButton>
            </div>
            <h1 className={styles.title}>Мережевий графік завдань</h1>
            <div className={styles.graphWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    nodesDraggable={isInteractive}
                    nodesConnectable={false}
                    elementsSelectable={true}
                >
                    <Background />
                    <Controls onInteractiveChange={handleInteractToggle} />
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
};

const TaskNetwork = () => {
    const dispatch = useDispatch();
    const { groups, nodePositions } = useSelector(selectGroups);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const initialData = useMemo(() => {
        if (!groups.items.length) {
            return {
                initialNodes: [
                    {
                        id: 'no-tasks',
                        type: 'default',
                        data: { label: 'Додайте задачі для відображення графіка' },
                        position: { x: 100, y: 100 },
                    }
                ],
                initialEdges: [],
                handleResetPositions: () => dispatch(resetNodePositions()),
            };
        }

        let allNodes = [];
        let allEdges = [];
        let groupOffsetX = 0;
        let groupOffsetY = 0;

        groups.items.forEach((group) => {
            const groupNodes = [];
            const groupEdges = [];

            group.tasks.forEach((task) => {
                const savedPosition = nodePositions[task._id] || { x: 0, y: 0 };
                groupNodes.push({
                    id: task._id,
                    type: 'default',
                    data: { label: `${task.title} (${group.title})` },
                    position: savedPosition,
                    style: { 
                        background: task.priority ? '#ffcc99' : 'khaki',
                        border: '1px solid #777',
                        padding: '10px',
                        borderRadius: '4px',
                    },
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
                        x: node.position.x + groupOffsetX,
                        y: node.position.y + groupOffsetY,
                    },
                };
            });

            allNodes = [...allNodes, ...offsetNodes];
            allEdges = [...allEdges, ...layoutedEdges];

            groupOffsetX += 400;
            groupOffsetY += groupHeight + 150;
        });

        return { initialNodes: allNodes, initialEdges: allEdges, handleResetPositions: () => dispatch(resetNodePositions()) };
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

    return (
        <ReactFlowProvider>
            <TaskNetworkInner initialData={initialData} onNodesChangeHandler={handleNodesChange} />
        </ReactFlowProvider>
    );
};

export default TaskNetwork;
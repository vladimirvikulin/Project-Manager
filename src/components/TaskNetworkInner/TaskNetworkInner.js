import React, { useState, useEffect } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    useNodesState, 
    useEdgesState
} from 'reactflow';
import { Link } from 'react-router-dom';
import MyButton from '../ui/button/MyButton';
import GanttChart from '../GanttChart/GanttChart';
import styles from '../../pages/TaskNetwork/TaskNetwork.module.css';
import 'reactflow/dist/style.css';

const TaskNetworkInner = ({ initialData, onNodesChangeHandler, ganttData, groups }) => {
    const [isInteractive, setIsInteractive] = useState(true);
    const [viewMode, setViewMode] = useState('graph');

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
                {viewMode === 'graph' && (
                    <MyButton onClick={initialData.handleResetPositions}>Скинути позиції</MyButton>
                )}
                <MyButton onClick={() => setViewMode('graph')}>
                    Мережевий графік
                </MyButton>
                <MyButton onClick={() => setViewMode('gantt')}>
                    Діаграма Ганта
                </MyButton>
            </div>
            <h1 className={styles.title}>Мережевий графік завдань</h1>
            {viewMode === 'graph' && (
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
            )}
            {viewMode === 'gantt' && (
                <GanttChart ganttData={ganttData} groups={groups} />
            )}
        </div>
    );
};

export default TaskNetworkInner;
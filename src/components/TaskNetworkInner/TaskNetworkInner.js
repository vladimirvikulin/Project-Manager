import React, { useState, useEffect } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    useNodesState, 
    useEdgesState,
    Handle,
} from 'reactflow';
import { Link } from 'react-router-dom';
import styles from './TaskNetworkInner.module.css';
import 'reactflow/dist/style.css';
import GanttChart from '../GanttChart/GanttChart';
import { FaList, FaProjectDiagram, FaChartBar, FaRedo } from 'react-icons/fa';

const CustomNode = ({ data, className }) => {
    return (
        <div className={className}>
            <Handle
                type="source"
                position="right"
                style={{ background: '#555', borderRadius: '50%', width: '8px', height: '8px' }}
            />
            <div>{data.label}</div>
            <Handle
                type="target"
                position="left"
                style={{ background: '#555', borderRadius: '50%', width: '8px', height: '8px' }}
            />
        </div>
    );
};

const nodeTypes = {
    customNode: CustomNode,
};

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
                <div className={styles.buttonGroup}>
                    <Link to="/" className={styles.backLink}>
                        <button className={styles.iconButton} aria-label="Список">
                            <FaList />
                            <span className={styles.tooltip}>Список</span>
                        </button>
                    </Link>
                    <button
                        onClick={() => setViewMode('graph')}
                        className={`${styles.iconButton} ${viewMode === 'graph' ? styles.activeIcon : ''}`}
                        aria-label="Мережевий графік"
                    >
                        <FaProjectDiagram />
                        <span className={styles.tooltip}>Мережевий графік</span>
                    </button>
                    <button
                        onClick={() => setViewMode('gantt')}
                        className={`${styles.iconButton} ${viewMode === 'gantt' ? styles.activeIcon : ''}`}
                        aria-label="Діаграма Ганта"
                    >
                        <FaChartBar />
                        <span className={styles.tooltip}>Діаграма Ганта</span>
                    </button>
                </div>
            </div>
            <h1 className={styles.title}>
                {viewMode === 'graph' ? 'Мережевий графік завдань' : 'Діаграма Ганта'}
            </h1>
            {viewMode === 'graph' && (
                <div className={styles.buttonGroup && styles.buttonWrapper}>
                    <button
                        onClick={initialData.handleResetPositions}
                        className={styles.iconButton}
                        aria-label="Скинути позиції"
                    >
                        <FaRedo />
                        <span className={styles.tooltip}>Скинути позиції</span>
                    </button>
                </div>
            )}
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
                        nodeTypes={nodeTypes}
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
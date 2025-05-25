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
import MyButton from '../../components/ui/button/MyButton';

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
                <div className={styles.buttonGroupLeft}>
                    <Link to="/" className={styles.backLink}>
                        <MyButton>Назад</MyButton>
                    </Link>
                </div>
                <div className={styles.buttonGroup}>
                </div>
            </div>
            <h1 className={styles.title}>Мережевий графік завдань</h1>
            <div className={styles.buttonGroup && styles.buttonWrapper}>
                <MyButton
                    onClick={initialData.handleResetPositions}
                    className={styles.resetButton}
                >
                    Скинути позиції
                </MyButton>
            </div>
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
        </div>
    );
};

export default TaskNetworkInner;
const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffInMs = d1 - d2;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

export const calculateTimings = (tasks, groupCreatedAt) => {
    try {
        const validTasks = tasks.map(task => {
            const validDependencies = (task.dependencies || []).filter(depId =>
                tasks.some(t => t._id === depId)
            );
            return { ...task, dependencies: validDependencies };
        });

        const nodes = validTasks.map(task => ({
            ...task,
            earliestStart: 0,
            earliestFinish: 0,
            latestStart: 0,
            latestFinish: 0,
            slack: 0,
            deadlineMissed: false,
        }));

        const taskMap = new Map(nodes.map(node => [node._id, node]));
        const startNodes = nodes.filter(node => !node.dependencies || node.dependencies.length === 0);

        const queue = [...startNodes];
        const visited = new Set();

        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current._id)) continue;
            visited.add(current._id);

            const createdAt = new Date(groupCreatedAt);
            const taskCreatedAt = new Date(current.createdAt || groupCreatedAt);
            const daysSinceGroupCreation = getDaysDifference(taskCreatedAt, createdAt);
            console.log(`Task ${current.title}: groupCreatedAt=${groupCreatedAt}, taskCreatedAt=${taskCreatedAt}, daysSinceGroupCreation=${daysSinceGroupCreation}`);
            const minEarliestStart = Math.max(0, daysSinceGroupCreation);

            if (current.dependencies && current.dependencies.length > 0) {
                const maxDependencyFinish = Math.max(
                    ...current.dependencies.map(depId => taskMap.get(depId).earliestFinish)
                );
                current.earliestStart = Math.max(maxDependencyFinish, minEarliestStart);
            } else {
                current.earliestStart = minEarliestStart;
            }

            current.earliestFinish = current.earliestStart + (current.duration || 1);

            nodes.forEach(node => {
                if (node.dependencies && node.dependencies.includes(current._id)) {
                    queue.push(node);
                }
            });
        }

        const maxEarliestFinish = Math.max(...nodes.map(node => node.earliestFinish || 0));

        const endNodes = nodes.filter(node => 
            !nodes.some(n => n.dependencies && n.dependencies.includes(node._id))
        );

        const reverseQueue = [...endNodes];
        const reverseVisited = new Set();

        while (reverseQueue.length > 0) {
            const current = reverseQueue.shift();
            if (reverseVisited.has(current._id)) continue;
            reverseVisited.add(current._id);

            if (!nodes.some(node => node.dependencies && node.dependencies.includes(current._id))) {
                if (current.deadline) {
                    const deadlineDate = new Date(current.deadline);
                    const createdAt = new Date(groupCreatedAt);
                    const deadlineDays = getDaysDifference(deadlineDate, createdAt);
                    current.latestFinish = deadlineDays;
                } else {
                    current.latestFinish = maxEarliestFinish;
                }
            } else {
                const minDependentStart = Math.min(
                    ...nodes
                        .filter(node => node.dependencies && node.dependencies.includes(current._id))
                        .map(node => node.latestStart)
                );
                if (current.deadline) {
                    const deadlineDate = new Date(current.deadline);
                    const createdAt = new Date(groupCreatedAt);
                    const deadlineDays = getDaysDifference(deadlineDate, createdAt);
                    current.latestFinish = Math.min(minDependentStart, deadlineDays);
                } else {
                    current.latestFinish = minDependentStart;
                }
            }

            current.latestFinish = Math.max(current.latestFinish, current.earliestFinish);
            current.latestStart = current.latestFinish - (current.duration || 1);
            current.latestStart = Math.max(current.latestStart, current.earliestStart);
            current.slack = current.latestStart - current.earliestStart;

            if (current.deadline) {
                const deadlineDate = new Date(current.deadline);
                const createdAt = new Date(groupCreatedAt);
                const deadlineDays = getDaysDifference(deadlineDate, createdAt);
                current.deadlineMissed = current.earliestFinish > deadlineDays;
            }

            if (current.dependencies && current.dependencies.length > 0) {
                current.dependencies.forEach(depId => {
                    const dep = taskMap.get(depId);
                    if (dep) reverseQueue.push(dep);
                });
            }
        }

        const createdAt = new Date(groupCreatedAt);
        nodes.forEach(node => {
            node.earliestStartDate = new Date(createdAt);
            node.earliestStartDate.setDate(createdAt.getDate() + node.earliestStart);
            node.earliestFinishDate = new Date(createdAt);
            node.earliestFinishDate.setDate(createdAt.getDate() + node.earliestFinish);
            node.latestStartDate = new Date(createdAt);
            node.latestStartDate.setDate(createdAt.getDate() + node.latestStart);
            node.latestFinishDate = new Date(createdAt);
            node.latestFinishDate.setDate(createdAt.getDate() + node.latestFinish);
        });

        return nodes;
    } catch (error) {
        console.error('Error in calculateTimings:', error);
        return tasks.map(task => ({
            ...task,
            earliestStart: 0,
            earliestFinish: task.duration || 1,
            latestStart: 0,
            latestFinish: task.duration || 1,
            earliestStartDate: new Date(groupCreatedAt),
            earliestFinishDate: new Date(groupCreatedAt),
            latestStartDate: new Date(groupCreatedAt),
            latestFinishDate: new Date(groupCreatedAt),
            slack: 0,
            deadlineMissed: false,
        }));
    }
};

export const optimizeGantt = (tasks) => {
    const sortedTasks = [...tasks].sort((a, b) => a.earliestStart - b.earliestStart);
    let executors = [];

    sortedTasks.forEach(task => {
        let placed = false;
        for (let i = 0; i < executors.length; i++) {
            const lastTaskInRow = executors[i][executors[i].length - 1];
            if (!lastTaskInRow || lastTaskInRow.earliestFinish < task.earliestStart) {
                const canPlace = task.dependencies.every(depId => {
                    const depRow = executors.find(row => row.some(t => t._id === depId));
                    if (!depRow) return true;
                    return depRow.find(t => t._id === depId).earliestFinish <= task.earliestStart;
                });

                if (canPlace) {
                    executors[i].push(task);
                    placed = true;
                    break;
                }
            }
        }
        if (!placed) {
            executors.push([task]);
        }
    });

    let optimizedExecutors = [];
    executors.forEach((executor, executorIndex) => {
        executor.forEach(task => {
            let placed = false;
            for (let i = 0; i < optimizedExecutors.length; i++) {
                const lastTaskInRow = optimizedExecutors[i][optimizedExecutors[i].length - 1];
                if (!lastTaskInRow || lastTaskInRow.earliestFinish < task.earliestStart) {
                    const canPlace = task.dependencies.every(depId => {
                        const depRow = optimizedExecutors.find(row => row.some(t => t._id === depId));
                        if (!depRow) return true;
                        return depRow.find(t => t._id === depId).earliestFinish <= task.earliestStart;
                    });

                    if (canPlace) {
                        optimizedExecutors[i].push(task);
                        placed = true;
                        break;
                    }
                }
            }
            if (!placed) {
                optimizedExecutors.push([task]);
            }
        });
    });

    return optimizedExecutors;
};
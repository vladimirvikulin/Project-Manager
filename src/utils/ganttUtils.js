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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                deadlineDate.setHours(0, 0, 0, 0);
                current.deadlineMissed = (deadlineDate < today) || (current.earliestFinish > deadlineDays);
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

export const sortTasksWithDependencies = (tasks) => {
    const sortedTasks = [];
    const visited = new Set();
    const taskMap = new Map(tasks.map(task => [task._id, task]));

    const visit = (taskId) => {
        if (visited.has(taskId)) return;
        visited.add(taskId);

        const task = taskMap.get(taskId);
        if (task && task.dependencies) {
            task.dependencies.forEach(depId => visit(depId));
        }
        if (task) sortedTasks.push(task);
    };

    tasks.forEach(task => {
        if (!visited.has(task._id)) {
            visit(task._id);
        }
    });

    return sortedTasks;
};

export const calculateTaskLevel = (occupiedIntervals, startDay, endDay) => {
    let level = 0;
    for (let currentLevel = 0; ; currentLevel++) {
        const hasOverlap = occupiedIntervals.some(interval =>
            interval.level === currentLevel && !((interval.endDay <= startDay) || (endDay <= interval.startDay))
        );
        if (!hasOverlap) {
            level = currentLevel;
            break;
        }
    }
    return level;
};

export const optimizeSchedule = (tasks, members, groupCreatedAt) => {
    const adjustedTasks = calculateTimings(tasks, groupCreatedAt);
    const minStartDate = new Date(Math.min(...adjustedTasks.map(task => task.earliestStartDate)));
    const executors = [];

    let executorCount = 1;
    let allTasksAssigned = false;

    while (!allTasksAssigned) {
        executors.length = 0;
        for (let i = 0; i < executorCount; i++) {
            executors.push({ tasks: [], occupiedIntervals: [] });
        }

        allTasksAssigned = true;
        for (const task of adjustedTasks) {
            let assigned = false;
            for (const executor of executors) {
                const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
                const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
                const endDay = startDay + taskDays;

                const hasOverlap = executor.occupiedIntervals.some(interval =>
                    !(interval.endDay <= startDay || endDay <= interval.startDay)
                );

                if (!hasOverlap) {
                    executor.tasks.push(task);
                    executor.occupiedIntervals.push({ startDay, endDay, level: 0 });
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                allTasksAssigned = false;
                break;
            }
        }

        if (!allTasksAssigned) {
            executorCount++;
        }
    }

    executors.forEach(executor => {
        executor.tasks.sort((a, b) => new Date(a.earliestStartDate) - new Date(b.earliestStartDate));
        const taskOffsets = new Map();
        executor.occupiedIntervals = [];

        executor.tasks.forEach((task, index) => {
            const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
            const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
            const endDay = startDay + taskDays;

            const level = calculateTaskLevel(executor.occupiedIntervals, startDay, endDay);

            taskOffsets.set(task._id, level * 50);
            executor.occupiedIntervals.push({ startDay, endDay, level });
        });

        const maxLevel = Math.max(...Array.from(taskOffsets.values()).map(offset => offset / 50), 0);
        executor.tasks = executor.tasks.map(task => ({
            ...task,
            offsetY: taskOffsets.get(task._id) || 0,
        }));
        executor.maxLevel = maxLevel;
    });

    return executors;
};
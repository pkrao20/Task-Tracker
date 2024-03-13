const User = require('../models/user');
const Task = require('../models/task');
const user = require('../models/user');

const addTask = async (req, res) => {
    const { email, title, description, status, dueDate } = req.body;
    const task = new Task({
        title, description, status, dueDate
    })
    await task.save();

    const isExist = await User.findOne({ email });
    if (isExist) {
        const id = task._id;
        isExist.tasks.push(id);
        await isExist.save();
        res.status(200).json({ message: "Task added successfully", user: isExist });
        // console.log("addedd successfully");
    }
    else {
        res.status(404).json({ error: "user does not exist" });

    }
};

const allTasks = async (req, res) => {
    console.log("reached here");
    const { email } = req.body;
    const isExist = await User.findOne({ email });

    if (isExist) {
        const tasks = isExist.tasks;
        res.status(200).json({ task: tasks,user:isExist });

    } else {
        res.status(404).json({ error: "user does not exist" });
    }

};

const deleteTask = async (req, res) => {
    const { email, id } = req.body;
    const isExist = await User.findOne({ email });

    if (isExist) {
        isExist.tasks = isExist.tasks.filter(task => task._id.toString() !== id);
        await isExist.save();
        res.status(200).json({ message: "Task deleted successfully", user: isExist });
    }
    else {
        res.status(404).json({ error: "User does not exist" });
    }

};

const markComplete = async (req, res) => {
    const { email, id } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {

        const f = await Task.findById({ _id: id });

        if (!f) {
            res.status(200).json({ message: "Task does not exist", user: isExist });
        } else if (f.status === "completed") {
            res.status(200).json({ message: "Already completed", user: isExist });
        } else {
            f.status = "completed";
            await f.save();
            res.status(200).json({ message: "Sucessfully marked completed", user: isExist });
        }

    }
    else {
        res.status(404).json({ error: "user does not exist" });
    }
};
//searching
const searchQuery = async (req, res) => {
    const userId = req.params.userId;
    const key = req.params.key;
    const user = await User
        .findById(userId)
        .find({ count: { $gte : 5 } })
        .populate(
        {
            path: 'tasks',
            match: {
                $or: [
                    {
                        title: { $regex: key, $options: 'i' }
                    },
                    {
                        description: { $regex:key, $options: 'i' }
                    },
                ]
            }
        }
    );
    console.log(user);
    if (!user) {
        res.status(404).json({ error: "User does not exist" });
    } else {
        res.status(200).json({ task: user.tasks});
    }

}

//

module.exports = {
    allTasks,
    addTask,
    deleteTask,
    markComplete,
    searchQuery
};
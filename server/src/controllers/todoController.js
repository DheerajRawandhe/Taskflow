import Todo from "../models/todo.models.js";
// Get all todos

export const getTodos = async (req, res) => {
    try {
        // Read filters from req.query for GET requests
        const { page = 1, limit = 10, completed, priority, category, search } = req.query;
        const filter = { userId: req.user.id, isArchived: false };
        if (completed !== undefined) {
            filter.completed = completed == 'true';
        }
        if (priority) {
            filter.priority = priority;
        }
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const todos = await Todo.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Todo.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                todos,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Get the single todo
export const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            userId: req.user.id
        })
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            })
        }
        res.status(200).json({
            success: true,
            data: { todo }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Create a new todo
export const createTodo = async (req, res) => {
    try {
        const todoData = {
            ...req.body,
            userId: req.user.id
        }
        const todo = await Todo.create(todoData);
        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: { todo }
        })
    } catch (error) {
      res.status(400).json({
      success: false,
      message: error.message
    });
    }
}
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: { todo }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



export const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo status updated successfully',
      data: { todo }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
import Category from '../models/category.models.js';

// Default categories that all users will see
const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#3b82f6' },
  { name: 'Personal', color: '#a21caf' },
  { name: 'Shopping', color: '#22c55e' },
  { name: 'Health', color: '#f97316' }
];

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user?.id; // Get from authenticated user

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if category name already exists for this user
    const existingCategory = await Category.findOne({ 
      userId, 
      name: name.trim() 
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new Category({ 
      name: name.trim(), 
      color: color || '#3b82f6', 
      userId 
    });
    
    await category.save();
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories (default + user's custom categories)
export const getCategories = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get user's custom categories
    const userCategories = await Category.find({ userId });

    // Combine default categories with user's custom categories
    const allCategories = [
      ...DEFAULT_CATEGORIES.map((cat, index) => ({
        _id: `default-${index}`,
        name: cat.name,
        color: cat.color,
        userId: 'default',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ...userCategories
    ];

    res.json({ success: true, data: { categories: allCategories } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category (only user's custom categories)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if trying to update a default category
    if (id.startsWith('default-')) {
      return res.status(403).json({ message: 'Cannot modify default categories' });
    }

    // Verify the category belongs to the user
    const category = await Category.findOne({ _id: id, userId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found or access denied' });
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        userId, 
        name: name.trim(),
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name?.trim(), color },
      { new: true }
    );

    res.json({ success: true, data: { category: updatedCategory } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category (only user's custom categories)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if trying to delete a default category
    if (id.startsWith('default-')) {
      return res.status(403).json({ message: 'Cannot delete default categories' });
    }

    // Verify the category belongs to the user
    const category = await Category.findOne({ _id: id, userId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found or access denied' });
    }

    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

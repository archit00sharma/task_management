const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true,
            index: true
        },
        user_id: {
            type: mongoose.Schema.ObjectId
        },
        due_date: {
            type: Date,
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
            required: true,
            index: true
        },
        is_deleted: {
            type: Boolean,
            default: false,
            index: true
        }

    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);

const task = mongoose.model("Task", taskSchema);
module.exports = { task };

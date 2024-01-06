'use strict'


const fp = require('fastify-plugin');


const { task } = require('../models/task')

const taskServices = (fastify) => {

    const read = async (cond) => await task.findOne(
        cond,
    ).catch((err) => {
        throw err;
    });

    const create = async (data) => await task.create(
        data,
    ).catch((err) => {
        throw err;
    });

    const update = async (id, data) => await task.findOneAndUpdate(
        { _id: id }, { $set: data }, { new: true }
    ).catch((err) => {
        throw err;
    });

    const all = async (page_no, no_of_records, cond = {}) => {

        const dataPipeline = [
            {
                $match: {
                    is_deleted: false,
                    ...cond,
                },
            },
            {
                $skip: page_no > 1 ? no_of_records * (page_no - 1) : 0,
            },
            {
                $limit: no_of_records,
            }
        ];

        const pipeline = [
            {
                $facet: {
                    total_records: [
                        {
                            $match: {
                                is_deleted: false,
                                ...cond
                            },
                        }, {
                            $count: 'count',
                        },
                    ],
                    data: dataPipeline,
                },
            },
        ];

        return await task.aggregate(
            pipeline,
        ).catch((err) => {
            throw err;
        });
    };

    const readAll = async (cond = {}) => await task.find(cond).catch((err) => {
        throw err;
    });

    return {
        read,
        create,
        update,
        all,
        readAll
    };
};

module.exports = fp((fastify, options, next) => {
    fastify.decorate('taskServices', taskServices(fastify));
    next();
});

module.exports = function(ORM){
    'use strict';

    return {
        name:'Snapshot',
        schema:{
            params: ORM.TEXT,
            notes:ORM.TEXT,
            console:ORM.TEXT,
            message:ORM.TEXT,
            /**
             * Queued, Capturing, Complete
             */
            state:{
                type:ORM.STRING,
                validate:{
                    isIn:[['Queued', 'Capturing', 'Complete', 'Failure']]
                }
            }
        },
        options:{
            classMethods:{
                'QUEUED':'Queued',
                'CAPTURING':'Capturing',
                'COMPLETE':'Complete',
                'FAILURE':'Failure'
            },
            paranoid:true,
            scopes:{
                deleted:{
                    where:['deletedAt IS NOT NULL']
                }
            }
        },
        relationships:[
            {   kind:   "belongsTo",
                model:  "Page"
            },{
                kind:   "belongsTo",
                model:  "Image"
            },{
                kind:   "hasMany",
                model:  "MasterSnapshot"
            },{
                kind:   "hasMany",
                model:  "SnapshotDiff",
                options:{ as:"snapshotDiffA", foreignKey:"snapshotAId"}
            },{
                kind:   "hasMany",
                model:  "SnapshotDiff",
                options:{ as:"snapshotDiffB", foreignKey:"snapshotBId"}
            }

        ]
    };

};
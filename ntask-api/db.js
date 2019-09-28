import fs from "fs"
import path from "path"
import Sequelize from "sequelize";

let db = null;

module.exports = app => {
    if (!db) {
        const config = app.libs.config;
        const sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.params
        );

        db = {
            sequelize,
            Sequelize,
            models: {}
        };

        const dir = path.join(__dirname, "models");
        fs.readdirSync(dir).forEach(file => {
            const modeDir = path.join(dir, file);
            const model = sequelize.import(modeDir);
            db.models[model.name] = model;
        });
        
        // Object.keys(db.models).forEach(key => {
        //     db.models[key].associate(db.models);
        // });
        // if (typeof Object.keys(db.models) !== 'undefined' && Object.keys(db.models).length > 0) {
        //     Object.keys(db.models).forEach(key =>{
        //         if (db.models[key].hasOwnProperty('associate')){
        //             db.models[key].associate(db.models);
        //         }
        //     });
        // }

        Object.keys(db.models).forEach(key =>{
            if (db.models[key].hasOwnProperty('associate')){
                db.models[key].associate(db.models);
            }
        });
    }
    return db;
};


import * as express from "express";
import { Request, Response } from "express"
import { createConnection } from "typeorm"
import * as cors from 'cors';
import routes from "./routes";
const PORT =process.env.PORT || 3000
import helmet from "helmet";
createConnection().then(async connection => {

    // create express app
    const app = express();
  //Middlewares
     app.use(cors());
     app.use(helmet());
     app.use(express.json());
     app.use('/',routes);
     //app.use(express.static("public"));

    // start express server
    app.listen(PORT,()=>console.log(`server running on port ${PORT} `));

    

    //console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))

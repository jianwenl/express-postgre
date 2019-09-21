const {Client} = require("pg")
const express = require ("express")
const app = express();
app.use(express.json())

const client = new Client({
    "user": "postgres",
    "password" : "postgres",
    "host" : "localhost",
    "port" : 5433,
    "database" : "testwithnode"
})


app.get("/todos", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type","application/json");
    res.send(JSON.stringify(rows));
})

app.post("/todos", async (req, res) => {
    let result = {}
    try {

        const reqJson= req.body;

        await createTodo(reqJson.name);
        result.success= true;
        
            
    } catch (e) {
        result.success= false;
    }
    finally{
        res.setHeader("content-type","application/json");
        res.send(JSON.stringify(result));
    }
})


app.delete("/todos", async (req, res) => {
    let result = {}
    try {

        const reqJson= req.body;

        await deleteTodo(reqJson.name);
        result.success= true;
        
            
    } catch (e) {
        result.success = false;
    }
    finally{
        res.setHeader("content-type","application/json");
        res.send(JSON.stringify(result));
    }
})


app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
    const results = await client.query("select id, name from employees");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createTodo(todoText){

    try {
        await client.query("insert into employees (name) values ($1)", [todoText]);
        return true
        }
        catch(e){
            return false;
        }
}



async function deleteTodo(id){

    try {
        await client.query("delete from employees where id = $1", [id]);
        return true
        }
        catch(e){
            return false;
        }
}

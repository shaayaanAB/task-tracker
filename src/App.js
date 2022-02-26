import './App.css';
import Header from './components/Header';
import Tasks from './components/Tasks';
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
// import About from './components/About';


function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect( () => {
      const getTasks = async() => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //fetch tasks
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

    //fetch task
    const fetchTask = async(id) => {
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await res.json()
      return data
    }

 const noTaskAvailable = () => {
  // show a animated spinner when no task available 
  return (
     <div className='spinner'>
       <div className='dot'></div>
       <div className='dot'></div>
       <div className='dot'></div>
       <div className='dot'></div>
       <div className='dot'></div>
     </div>
   )
 }
 
  // add new task
 const addTask = async (task) => {
   const res = await fetch('http://localhost:5000/tasks',
   {
     method: 'POST', 
     headers: {
      'Content-type' : 'application/json'
      },
      body:
        JSON.stringify(task),
    })

  const data = await res.json()
  setTasks([...tasks, data])
}

  // delete a task
  const deleteTask = async (id) => {
    fetch(`http://localhost:5000/tasks/${id}`,
     {method: 'DELETE'}
    )
    setTasks(tasks.filter((task) => task.id !== id ))
  }

  // toggle task's reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle,
       reminder: !taskToToggle.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task ))
  }

  return (
    <Router>
      <div className='container'>
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        {showAddTask && <AddTask onAdd={addTask} />}
        { tasks.length>0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : noTaskAvailable() }
        {/* <Route path='/about' component={About} /> */}
        <Footer />
      </div>
    </Router>
  );
}
  
export default App;

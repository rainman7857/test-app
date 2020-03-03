import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import Loader from 'react-loader-spinner'
import Modal from 'react-modal';

import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const courses = ["Technical Report Writing", "English Literature", "Computer Sciences"];
const subject_1 = [{value: "subject_1_value_1", label: "Short Reports"}, {value: "subject_1_value_2", label: "Annual Reports"}, {value: "subject_1_value_3", label: "Presentations"}];
const subject_2 = [{value: "subject_2_value_1", label: "Poetry"}, {value: "subject_2_value_2", label: "Short Stories"}, {value: "subject_2_value_3", label: "Drama"}];
const subject_3 = [{value: "subject_3_value_1", label: "Web Development"}, {value: "subject_3_value_2", label: "Desktop Software Development"}, {value: "subject_3_value_3", label: "Research and Analysis"}];
const dates = ["20 December 2019", "15 January 2020", "1 February 2020"]

const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)'} };

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course_i, setCourseIndex] = useState(0);
  const [selectedOption, setOption] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [notes, setNotes] = useState('')
  const [completed, setCompleted] = useState(false)
  const [modalText, setModalText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  return (
    <div>
      <form onSubmit={(event) => {
        event.preventDefault()
        const checkUsername = checkValid("username", username)
        const checkEmail = checkValid("email", email)
        const checkPassword = checkValid("password", password)
        const checkSubject = checkValid("subject", selectedOption)
        const checkDate = checkValid("date", startDate)
        const checkNotes = checkValid("notes", notes)
        const showErr = checkUsername || checkEmail || checkPassword || checkSubject || checkDate || checkNotes
        if(showErr){
          setModalText(showErr)
          setIsOpen(true)
        } else {
          setCompleted(true);
          setTimeout(() => {
            setCompleted(false)
            setModalText("Your course has been successfully registered.")
            setIsOpen(true)
          }, 3000)
        }
      }} disabled={true}>
        <input type="text" value={username} name="username" placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
        <input type="email" value={email} name="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
        <input type="password" value={password} name="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />

        {courses.map((item, i) => {
          return(
            <div key={i}>
              <label> <input type="radio" value={item} checked={i === course_i} onChange={() => { setCourseIndex(i); setOption("") }}/> {item} </label>
            </div>
          )
        })}

        <Select
          value={selectedOption}
          onChange={(value) => setOption(value)}
          options={course_i === 0 ? subject_1 : course_i === 1 ? subject_2 : subject_3}
        />

        <DatePicker
          selected={startDate}
          onChange={(date) => {
            const date_timestamp = getTimestamp(date.setHours(0,0,0,0))
            if(date_timestamp === getTimestamp(dates[0]) || date_timestamp === getTimestamp(dates[1]) || date_timestamp === getTimestamp(dates[2])){
              setStartDate(date)
            } else {
              setModalText("Your selected course and subject is not offered beginning from your selected date")
              setIsOpen(true)
            }
          }}
        />

        <div>
          <textarea maxLength={500} placeholder="Additional Notes" value={notes} onChange={(event) => setNotes(event.target.value)}>

          </textarea>
        </div>

        <div>
          {completed ?
            <Loader type="Oval" color="#00BFFF" height={30} width={30} timeout={3000} />
            :
            <button type="submit">Submit</button>
          }
        </div>
      </form>

      <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={() => setIsOpen(false)}><h1>{modalText}</h1></Modal>

    </div>
  );
}
function getTimestamp(date){
  const timestamp = new Date(date).getTime()
  return timestamp
}

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

function checkValid(name, value){
  let err = ""
  switch (name) {
    case 'username':
      err = value.length < 5 ? 'Username must be 5 characters long!' : false;
      break;
    case 'email':
      err = validEmailRegex.test(value) ? false : 'Email is not valid!';
      break;
    case 'password':
      err = value.length < 8 ? 'Password must be 8 characters long!' : false;
      break;
    case 'subject':
      err = value.length < 1 ? 'Please choose Subject.' : false;
      break;
    case 'date':
      err = value ? false : 'Please choose the date.';
      break;
    case 'notes':
      err = value.trim().length === 0 ? false : value.trim().length < 20 ? "Additional Notes must be 20 characters long!" : false
      break;
    default:
      break;
  }
  return err
}

export default App;

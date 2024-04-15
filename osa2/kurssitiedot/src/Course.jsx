import React from 'react'

const Course = ({course}) => {
    //console.log("name: ", course.name)
    return (
    <div>
      <Header header={course}></Header>
      <div>
        <Content parts={course.parts} ></Content>
      </div>
      <div>
        <ExCalc parts={course.parts} ></ExCalc>
      </div>
    </div>
    )
  }
   
  
  const Header = ({header}) => {
    return (
      <h2>
        {header.name}
      </h2>
    )
  }
  
  const Part = (props) => {
   // console.log(props)
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    return (
      <div> 
        {props.parts.map((part, index) => (
          <Part key={index} part={part} />
        ))}
      </div>
    )
  }
  
  const ExCalc = (props) => {
    const totalExercises = props.parts.reduce((total, part) => {
      return total + part.exercises
    }, 0)
  
    return (
      <div style={{ fontWeight: "bold" }}>
        total of {totalExercises} exercises
      </div>
    )
  }

  export default Course
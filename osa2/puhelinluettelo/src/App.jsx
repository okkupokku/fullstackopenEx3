import { useEffect, useState } from 'react';
import axios from 'axios';
import contactsService from './services/contacts';

const PersonForm = ({ addPerson }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addPerson({ name, number });
    setName('');
    setNumber('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={name} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = ({ value, onChange }) => {
  return (
    <div>
      Filter: <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonList = ({ persons, onDelete }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <li key={index}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const PhonebookApp = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (person) => {
    const existingPerson = persons.find(p => p.name === person.name);
    if (existingPerson) {
      const confirmUpdate = window.confirm(`${person.name} is already added to the phonebook. Do you want to update the number?`);
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: person.number };
        contactsService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            window.alert(`${person.name}'s number has been updated.`);
          })
          .catch(error => {
            console.error("Error updating person:", error);
            setErrorMessage(`information on ${person.name} has already been remove from the server`)
          });
      }
    } else {
      contactsService.create(person)
        .then(returnedPerson => {
          setPersons([...persons, returnedPerson]);
          setSuccessMessage(`${returnedPerson.name} has been successfully added.`);
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000); // Hide the message after 3 seconds
        })
        .catch(error => {
          console.error("Error adding person:", error);
          window.alert("An error occurred while adding the contact.");
        });
    }
  };

  const deletePerson = (personToDelete) => {
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`);
    if (confirmDelete) {
      contactsService.remove(personToDelete.id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== personToDelete.id));
          // Provide feedback to the user
          window.alert(`${personToDelete.name} has been deleted.`);
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          setErrorMessage("An error occurred while deleting the contact.");
        });
    }
  };
  
  

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && (
        <div style={{ fontSize: 20, color: 'green', border: '2px solid green', backgroundColor: 'lightgray', padding: '5px' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ border: '2px solid red', backgroundColor: 'lightgray', color: 'red', padding: '5px' }}>
          {errorMessage}
        </div>
      )}
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new person</h3>
      <PersonForm addPerson={addPerson} />
      <h3>Numbers</h3>
      <PersonList persons={filteredPersons} onDelete={deletePerson}/>
     
    </div>
  );
};

export default PhonebookApp;

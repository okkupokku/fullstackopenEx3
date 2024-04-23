import { useState } from 'react';

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

const PersonList = ({ persons }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <li key={index}>{person.name} {person.number}</li>
      ))}
    </ul>
  );
};

const PhonebookApp = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (person) => {
    if (persons.some(p => p.name === person.name)) {
      window.alert(`${person.name} is already added to the phonebook.`);
      return;
    }
    setPersons([...persons, person]);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new person</h3>
      <PersonForm addPerson={addPerson} />
      <h3>Numbers</h3>
      <PersonList persons={filteredPersons} />
    </div>
  );
};

export default PhonebookApp;

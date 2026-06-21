/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visiblePeople, setVisiblePeople] = useState(peopleFromServer);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (normalizedQuery === '') {
      setVisiblePeople(peopleFromServer);

      return;
    }

    setVisiblePeople(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [debouncedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${
            isOpen && visiblePeople.length > 0 ? 'is-active' : ''
          }`}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={changeEvent => {
                setQuery(changeEvent.target.value);
                setSelectedPerson(null);
                setIsOpen(true);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                    setIsOpen(false);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {visiblePeople.length === 0 && debouncedQuery.trim() !== '' && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger"> No matching suggestions </p>
          </div>
        )}
      </main>
    </div>
  );
};

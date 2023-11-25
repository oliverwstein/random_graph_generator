import React from 'react';
import './App.css';
import RandomWorldMap from './WorldMap';
import styled from "styled-components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Main>
          <RandomWorldMap />
        </Main>
      </header>
    </div>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default App;
import { createContext, useContext, useState } from "react"

// PROP DRILLING => QUANDO TEMOS MUITAS PROPRIEDADES APENAS PARA COMUNICAÇÃO ENTRE COMPONENTES
// CONTEXT API => FAZ O COMPARTILHAMENTO DE INFORMAÇÕES ENTRE VÁRIOS COMPONENTES AO MESMO TEMPO 

const CyclesContext = createContext({} as any)

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext)

  return (
    <h1>
      NewCycleFrom = {activeCycle}
      <hr />
      <button onClick={() => {
        setActiveCycle(2)
      }}>
        ALTERAR VALOR
      </button>
    </h1>
  )
}

function Countdown() {
  const { activeCycle } = useContext(CyclesContext)

  return (
    <h1>Countdown = {activeCycle}</h1>
  )
}

export function Home() {

  const [activeCycle, setActiveCycle] = useState(0)

  return (
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      <div>
        <NewCycleForm />
        <Countdown />
      </div>
    </CyclesContext.Provider>
  )
}
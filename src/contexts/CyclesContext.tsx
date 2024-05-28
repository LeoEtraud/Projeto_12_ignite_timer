import { ReactNode, createContext, useState, useReducer } from "react";

interface CreateCycleData {
    task: string;
    minutesAmount: number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

// CRIANDO UM CONTEXTO E ATRIBUINDO TIPOS A ELE  
export const CyclesContext = createContext({} as CyclesContextType)

// DEFINI QUALQUER CONTEÚDO QUE PODE SER USADO POR UM COMPONENTE REACT
interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {

    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {

        if (action.type == 'ADD_NEW_CYCLE') {
            return [...state, action.payload.newCycle]
        }

        return state
    }, [])

    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            },
        })

        // setCycles((state) =>
        //     state.map((cycle) => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, finishedDate: new Date() }
        //         } else {
        //             return cycle
        //         }
        //     }),
        // )
    }

    // FUNÇÃO PARA CRIAR UM CICLO DE UMA TAREFA
    function createNewCycle(data: CreateCycleData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        })

        // setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        // reset()
    }

    // FUNÇÃO PARA INTERROMPER O CICLO E RESETAR A CONTAGEM  
    function interruptCurrentCycle() {

        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId,
            },
        })

        // setCycles((state) =>
        // 	state.map((cycle) => {
        // 		if (cycle.id === activeCycleId) {
        // 			return { ...cycle, interruptedDate: new Date() }
        // 		} else {
        // 			return cycle
        // 		}
        // 	}),
        // )
        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider value={{
            cycles,
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>
            {children}
        </CyclesContext.Provider>
    )
}
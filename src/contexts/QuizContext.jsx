import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

const SECS_PER_QUESTION = 15;
const initialState = {
	questions: [],
	points: 0,
	status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished',
	index: 0,
	answer: null,
	highscore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, status: 'ready' };

		case 'dataFailed':
			return { ...state, status: 'error' };

		case 'start':
			return {
				...state,
				status: 'active',
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case 'finished':
			return {
				...state,
				status: 'finished',
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};

		case 'newAnswer':
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};

		case 'nextQuestion':
			return {
				...state,
				index: state.index++,
				answer: null,
			};
		case 'restart':
			return {
				...initialState,
				questions: state.questions,
				highscore: state.highscore,
				status: 'ready',
			};
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? 'finished' : state.status,
			};
		default:
			return state;
	}
}

function QuizProvider({ children }) {
	const [
		{ status, questions, points, index, answer, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);

	useEffect(function () {
		async function fetchQuestions() {
			try {
				const res = await fetch('http://localhost:8000/questions');
				const data = await res.json();

				dispatch({ type: 'dataReceived', payload: data });
			} catch (err) {
				dispatch({ type: 'dataFailed' });
			}
		}
		fetchQuestions();
	}, []);

	return (
		<QuizContext.Provider
			value={{
				status,
				questions,
				points,
				index,
				answer,
				highscore,
				secondsRemaining,
				dispatch,
			}}>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined)
		throw new Error('Quiz context was used outside of QuizProvider component');
	return context;
}

export { QuizProvider, useQuiz };

import { useEffect, useReducer } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

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

function App() {
	const [
		{ status, questions, points, index, answer, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);

	const numQuestions = questions.length;
	const maxPoints = questions
		.map((q) => q.points)
		.reduce((prev, cur) => prev + cur, 0);

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
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === 'active' && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPoints={maxPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{status === 'finished' && (
					<FinishScreen
						dispatch={dispatch}
						points={points}
						maxPoints={maxPoints}
						highscore={highscore}>
						You scored
					</FinishScreen>
				)}
			</Main>
		</div>
	);
}

export default App;

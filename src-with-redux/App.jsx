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
import { useQuiz } from './contexts/QuizContext';

function App() {
	const { questions, status, index } = useQuiz();

	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen />}
				{status === 'active' && (
					<>
						<Progress />
						<Question question={questions[index]} />
						<Footer>
							<Timer />
							<NextButton />
						</Footer>
					</>
				)}
				{status === 'finished' && <FinishScreen>You scored</FinishScreen>}
			</Main>
		</div>
	);
}

export default App;

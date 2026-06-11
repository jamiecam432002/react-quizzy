import { useQuiz } from '../contexts/QuizContext';
import Options from './Options';

export default function Question({ question }) {
	const { dispatch, answer } = useQuiz();
	return (
		<div>
			<h4>{question.question}</h4>
			<Options question={question} dispatch={dispatch} answer={answer} />
		</div>
	);
}

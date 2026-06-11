import { useQuiz } from '../contexts/QuizContext';

export default function Options({ question }) {
	const { dispatch, answer } = useQuiz();
	const hasAnswered = answer !== null;
	return (
		<div className='options'>
			{question.options.map((option, i) => (
				<button
					className={`btn btn-option ${hasAnswered && i === answer ? 'answer' : ''} ${hasAnswered ? (i === question.correctOption ? 'correct' : 'wrong') : ''}`}
					key={option}
					onClick={() => dispatch({ type: 'newAnswer', payload: i })}
					disabled={hasAnswered}>
					{option}
				</button>
			))}
		</div>
	);
}

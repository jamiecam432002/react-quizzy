import { useQuiz } from '../contexts/QuizContext';

export default function Progress() {
	const { index, questions, points, answer } = useQuiz();
	const numQuestions = questions.length;
	const maxPoints = questions
		.map((q) => q.points)
		.reduce((prev, cur) => prev + cur, 0);
	return (
		<header className='progress'>
			<progress max={numQuestions} value={index + Number(answer !== null)} />
			<p>
				Question <strong>{index + 1}</strong> / {numQuestions}
			</p>
			<p>
				<strong>{points}</strong> / {maxPoints}
			</p>
		</header>
	);
}

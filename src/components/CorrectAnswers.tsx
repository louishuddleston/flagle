export const CorrectAnswers = ({ answers }: { answers: string[] }) => {
  return (
    <div className="mt-3">
      <h1 className="font-bold">
        The correct {answers.length > 1 ? 'answers are:' : 'answer is:'}
      </h1>
      <div className="flex gap-2 pt-2 pb-2 justify-center items-center flex-wrap no-translate">
        {answers.map((answer) => (
          <div className="font-bold border-md border px-3 pt-1 pb-1 rounded-md">
            {answer}
          </div>
        ))}
      </div>
    </div>
  );
};

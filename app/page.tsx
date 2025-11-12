import SurveyForm from '../components/SurveyForm';

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          What do you want?
        </h1>
        <p className="mt-3 text-gray-600">
          Share your needs, frustrations, and goals. We?ll synthesize patterns to design better solutions.
        </p>
      </section>

      <div className="card">
        <SurveyForm />
      </div>
    </div>
  );
}

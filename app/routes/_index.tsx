import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

const feedbacksList = [
  {
    id: 1,
    title: "Lorem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, dicta fugit ad, aperiam quo doloremque eaque, pariatur laudantium sequi id officiis eos veritatis recusandae accusamus earum nobis quasi laboriosam nam.",
  },
  {
    id: 2,
    title: "Ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, quos exercitationem! Iusto, iure molestiae. Quisquam, ducimus cupiditate blanditiis dignissimos cumque harum. Fugit ab inventore iste possimus impedit maxime dolore nam!",
  },
];

export const loader = async () => {
  if (!feedbacksList) {
    return json({ error: "Lista não encontrada." }, { status: 404 });
  }

  return json({ feedbacks: feedbacksList });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const title = body.get("title");
  const description = body.get("description");
  const id = feedbacksList.length + 1;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    title.length === 0 ||
    description.length === 0
  ) {
    let validationErrors: {
      title: string | null;
      description: string | null;
    } = { title: null, description: null };

    if (typeof title !== "string" || title.length === 0) {
      validationErrors.title = "O título é obrigatório.";
    }

    if (typeof description !== "string" || description.length === 0) {
      validationErrors.description = "A descrição é obrigatória.";
    }

    return json(
      { success: false as const, errors: validationErrors },
      { status: 400 }
    );
  }

  feedbacksList.push({ id, title, description });

  return json({ success: true as const, data: "Feedback criado com sucesso!" });
};

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  const actionResponse = useActionData<typeof action>();

  return (
    <main className="flex flex-col items-center py-20 px-10 gap-20">
      <h1 className="text-3xl font-bold tracking-wider uppercase">
        Remix Feedback
      </h1>

      <section className="flex gap-10 max-w-5xl flex-col sm:flex-row">
        <Form
          method="POST"
          className="sticky max-w-[16rem] flex w-full flex-col self-start top-4 gap-5 rounded bg-neutral-800 p-5"
        >
          <fieldset className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="uppercase text-sm font-medium text-gray-100"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="bg-neutral-700 rounded p-1 w-full"
            />
            {actionResponse &&
            actionResponse.success === false &&
            actionResponse.errors.title ? (
              <p className="text-red-400">❌ {actionResponse.errors.title}</p>
            ) : null}
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="uppercase text-sm font-medium text-gray-100"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="bg-neutral-700 rounded p-1 w-full"
            />
            {actionResponse &&
            actionResponse.success === false &&
            actionResponse.errors.description ? (
              <p className="text-red-400">
                ❌ {actionResponse.errors.description}
              </p>
            ) : null}
          </fieldset>

          <button className="bg-purple-600 rounded p-2 hover:bg-purple-700 transition-all">
            Submit
          </button>
        </Form>

        <div className="flex flex-col gap-4">
          {"error" in loaderData ? (
            <div className="flex flex-col gap-2">
              <span className="text-lg font-bold uppercase text-red-500">
                {loaderData.error}
              </span>
            </div>
          ) : (
            loaderData.feedbacks.map((feedback) => (
              <div className="flex flex-col gap-2" key={feedback.title}>
                <span className="text-lg font-bold uppercase">
                  {feedback.title}
                </span>
                <p className="text-justify">{feedback.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

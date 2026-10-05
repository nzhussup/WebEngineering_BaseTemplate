import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Highlight } from '../search/Highlight.tsx';

interface Comment {
  readonly id: string;
  readonly name: string;
  readonly text: string;
}
interface Props {
  readonly query: string;
}
function CommentList({
  comments,
  query,
}: Props & { readonly comments: readonly Comment[] }): ReactElement {
  return (
    <ul className="comment-container">
      {comments.map((comment) => (
        <li key={comment.id}>
          <p>
            <Highlight text={comment.name} query={query} />
          </p>
          <p>
            <Highlight text={comment.text} query={query} />
          </p>
        </li>
      ))}
    </ul>
  );
}
function CommentForm({
  onAdd,
}: {
  readonly onAdd: (name: string, text: string) => void;
}): ReactElement {
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const text = data.get('comment');
    if (
      typeof name !== 'string' ||
      typeof text !== 'string' ||
      name.trim() === '' ||
      text.trim() === ''
    ) {
      setError('Enter your name and a comment.');
      return;
    }
    onAdd(name.trim(), text.trim());
    setError('');
    form.reset();
  }
  return (
    <form className="comment-form" onSubmit={submit}>
      <div className="flex-pair">
        <label htmlFor="name">Your name:</label>
        <input name="name" id="name" placeholder="Enter your name" required />
      </div>
      <div className="flex-pair">
        <label htmlFor="comment">Your comment:</label>
        <input
          name="comment"
          id="comment"
          placeholder="Enter your comment"
          required
        />
      </div>
      {error !== '' && <p role="alert">{error}</p>}
      <div>
        <input type="submit" value="Submit comment" />
      </div>
    </form>
  );
}
export function CommentsSection({ query }: Props): ReactElement {
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState<readonly Comment[]>([
    {
      id: 'initial-bob',
      name: 'Bob Fossil',
      text: 'Oh I am so glad you taught me all about the big brown angry guys...',
    },
  ]);
  function addComment(name: string, text: string): void {
    const comment = { id: crypto.randomUUID(), name, text };
    setComments((previous) => [...previous, comment]);
  }
  return (
    <section className="comments">
      <button
        type="button"
        className="show-hide"
        aria-expanded={visible}
        aria-controls="comment-wrapper"
        onClick={() => {
          setVisible((previous) => !previous);
        }}
      >
        {visible ? 'Hide comments' : 'Show comments'}
      </button>
      <div className="comment-wrapper" id="comment-wrapper" hidden={!visible}>
        <h2>
          <Highlight text="Add comment" query={query} />
        </h2>
        <CommentForm onAdd={addComment} />
        <h2>
          <Highlight text="Comments" query={query} />
        </h2>
        <CommentList comments={comments} query={query} />
      </div>
    </section>
  );
}

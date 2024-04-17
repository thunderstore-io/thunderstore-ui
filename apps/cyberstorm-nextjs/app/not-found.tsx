import errorStyles from "./Error.module.css";

export default function NotFound() {
  // TODO: Unify and improve errors into a single component
  return (
    <div className={errorStyles.root}>
      <div className={errorStyles.glitch} data-text={404}>
        <span>{404}</span>
      </div>
      <div className={errorStyles.description}>Page not found</div>
      <div className={errorStyles.flavor}>
        Oops! You found a glitch in the matrix.
      </div>
    </div>
  );
}

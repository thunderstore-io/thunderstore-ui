import styles from "./FormDemoLayout.module.css";

export const Notes = () => (
  <>
    <h2>Custom form field components</h2>
    <ul className={styles.notes}>
      <li>
        Documentation states that uncontrolled HTML elements are the preferred
        &quot;make it easy&quot; case, while custom components are the
        &quot;make it possible&quot; case.
      </li>
      <li>
        Different approaches are possible, had time to test only one. Had some
        problems, overcame most of them in reasonable time. Seems to have some
        learning curve though.
      </li>
    </ul>

    <h2>Dynamic forms</h2>
    <ul className={styles.notes}>
      <li>
        Did not test this yet. getValues and setValue methods are provided, so
        I&apos;d imagine it&apos;s quite possible.
      </li>
    </ul>

    <h2>Subforms</h2>
    <ul className={styles.notes}>
      <li>
        Supported out of the box, but again what seems easy on the docs for
        basic fields gets a bit hairy when using custom components.
      </li>
      <li>
        Again, different approaches are possible, had time to test only one.
      </li>
    </ul>

    <h2>Separation of layout and form logic</h2>
    <ul className={styles.notes}>
      <li>No problems working with CSS modules</li>
      <li>
        Using custom components seems to make the form component cleaner, but
        again that&apos;s not the library&apos;s preferred way.
      </li>
      <li>
        Documentation mentions{" "}
        <a href="https://react-hook-form.com/advanced-usage#SmartFormComponent">
          composition based approach
        </a>
        , but it doesn&apos;t work out of the box with TS and I didn&apos;t find
        working solutions quickly from internet. Might be very difficult to add
        support for custom components when using this approach.
      </li>
      <li>
        Provides automatic validation for basic fields, and supports integration
        with Zod and other libraries for more detailed validation.
      </li>
    </ul>

    <h2>Developer experience</h2>
    <ul className={styles.notes}>
      <li>
        Documentation seems to be on the usual &quot;not that great&quot; level.
        I found it especially annoying that &quot;built with TypeScript&quot; is
        paraded in the docs but then only some of the examples are provided in
        TypeScript.
      </li>
      <li>
        Definitely has a learning curve but can be a good tool when sufficient
        is invested.
      </li>
      <li>Author is active on GitHub, answering questions.</li>
    </ul>
  </>
);

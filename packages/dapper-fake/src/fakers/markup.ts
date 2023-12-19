export const getFakeChangelog = async () => ({
  html: `
<h2>v1.2.3</h2>
<ul>
<li>The gnomes are now deprecated and will be removed in the future versions</li>
<li>Ig you're still using the gnomes, don't.</li>
</ul>
<h2>v1.2.2</h2>
<ul>
<li>Give the gnomes unique names</li>
</ul>
<h2>v1.2.1</h2>
<ul>
<li>Reduce the number of gnomes to reasonable levels</li>
<li>Fix the things broken by the gnomes</li>
</ul>
<h2>v1.2.0</h2>
<ul>
<li>Add gnomes</li>
<li>So many gnomes</li>
<li>Everyone loves gnomes, right?</li>
</ul>
<h2>v1.0.1</h2>
<ul>
<li>Fix minor incredibly fatal bugs</li>
<li>Polish some corners</li>
</ul>
<h2>v1.0.0</h2>
<ul>
<li>Initial release with MVP feature set</li>
</ul>
`,
});

export const getFakeReadme = async () => ({
  html: `
<h1>Markdown syntax guide</h1>
<h2>This is a Heading h2</h2>
<h3>This is a Heading h3</h3>
<h4>This is a Heading h4</h4>
<h5>This is a Heading h5</h5>
<h6>This is a Heading h6</h6>
<h2>Emphasis</h2>
<p><em>This text will be italic</em> _This will also be italic_</p>
<p><strong>This text will be bold</strong><br>
<strong>This will also be bold</strong></p>
<p><em>You <strong>can</strong> combine them</em></p>
<h2>Lists</h2>
<h3>Unordered</h3>
<ul>
<li>Item 1</li>
<li>Item 2
<ul>
<li>Item 2a</li>
<li>Item 2b</li>
</ul>
</li>
</ul>
<h3>Ordered</h3>
<ol>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
<li>Item 3a</li>
<li>Item 3b</li>
</ol>
<h2>Images</h2>
<p><img alt="This is an alt text." src="/image/sample.png"></p>
<h2>Links</h2>
<p>You may be using <a href="https://markdownlivepreview.com/">Markdown Live Preview</a>.</p>
<h2>Blockquotes</h2>
<blockquote>
<p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
<blockquote>
<p>Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
</blockquote>
</blockquote>
<h2>Tables</h2>
<table>
<thead>
<tr>
<th>Left columns</th>
<th>Right columns</th>
</tr>
</thead>
<tbody>
<tr>
<td>left foo</td>
<td>right foo</td>
</tr>
<tr>
<td>left bar</td>
<td>right bar</td>
</tr>
<tr>
<td>left baz</td>
<td>right baz</td>
</tr>
</tbody>
</table>
<h2>Blocks of code</h2>
<pre><code>let message = 'Hello world';
alert(message);
</code></pre>
<h2>Inline code</h2>
<p>This web site is using <code>markedjs/marked</code>.</p>
`,
});

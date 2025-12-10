// --- PYTHON SYLLABUS ---
export const pythonSyllabus = [
  {
    id: 'web-dev',
    title: 'Understanding Web Development',
    category: 'general',
    children: [
      { id: 'web-fe', title: 'Frontend' },
      { id: 'web-be', title: 'Backend' },
      { id: 'web-fs', title: 'Full Stack' },
    ],
  },
  {
    id: 'setup',
    title: 'Setting Up Environment',
    category: 'devops',
    children: [
      { id: 'vscode', title: 'VS Code' },
      { id: 'git', title: 'Git & GitHub' },
    ],
  },
  {
    id: 'html',
    title: 'HTML',
    category: 'frontend',
    children: [
      { id: 'html-intro', title: 'What is HTML' },
      { id: 'html-struct', title: 'HTML Document Structure' },
      {
        id: 'html-elements',
        title: 'Elements & Tags',
        children: [
          { id: 'html-headings', title: 'Headings (h1-h6) & Paragraphs' },
          { id: 'html-links', title: 'Links & Anchors' },
        ]
      },
      { 
        id: 'html-lists', 
        title: 'Lists',
        children: [
            { id: 'list-ul', title: 'Unordered (ul)' },
            { id: 'list-ol', title: 'Ordered (ol)' },
            { id: 'list-dl', title: 'Description (dl)' }
        ]
      },
      { 
        id: 'html-tables', 
        title: 'Tables',
        children: [
            { id: 'tbl-row', title: 'Rows (tr) & Cells (td)' },
            { id: 'tbl-head', title: 'Headers (th)' },
            { id: 'tbl-struct', title: 'Thead, Tbody, Tfoot' }
        ]
      },
      { 
        id: 'html-forms', 
        title: 'Forms',
        children: [
            { id: 'form-input', title: 'Input Types' },
            { id: 'form-label', title: 'Labels & Textarea' },
            { id: 'form-submit', title: 'Buttons & Submission' }
        ]
      },
      { 
        id: 'html-semantic', 
        title: 'Semantic Tags',
        children: [
            { id: 'sem-layout', title: 'Header, Footer, Nav' },
            { id: 'sem-content', title: 'Article, Section, Aside' }
        ]
      },
      { id: 'html-meta', title: 'Meta Tags & SEO' },
    ],
  },
  {
    id: 'css',
    title: 'CSS',
    category: 'frontend',
    children: [
      { id: 'css-basics', title: 'CSS Basics (Selectors, Specificity)' },
      { id: 'css-box', title: 'Box Model (Margin, Padding, Border)' },
      { id: 'css-vis', title: 'Position, Z-Index, Display' },
      { 
        id: 'css-flex', 
        title: 'Flexbox',
        children: [
          { id: 'flex-display', title: 'Display: Flex' },
          { id: 'flex-dir', title: 'Flex Direction' },
          { id: 'flex-wrap', title: 'Flex Wrap' },
          { id: 'flex-justify', title: 'Justify Content' },
          { id: 'flex-align', title: 'Align Items' },
          { id: 'flex-gap', title: 'Gap' },
        ]
      },
      { 
        id: 'css-grid', 
        title: 'CSS Grid',
        children: [
          { id: 'grid-template', title: 'Grid Template Columns/Rows' },
          { id: 'grid-gap', title: 'Gap' },
          { id: 'grid-areas', title: 'Grid Areas' },
        ]
      },
      { id: 'css-style', title: 'Colors, Fonts, Backgrounds' },
      { 
        id: 'css-pseudo', 
        title: 'Pseudo-classes & Elements',
        children: [
            { id: 'pseudo-classes', title: ':hover, :focus, :active, :nth-child' },
            { id: 'pseudo-elements', title: '::before, ::after' }
        ]
      },
      { id: 'css-resp', title: 'Media Queries & Responsive Design' },
    ],
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS',
    category: 'frontend',
    children: [
      { id: 'tw-setup', title: 'Setup & Config' },
      { id: 'tw-util', title: 'Utility Classes' },
      { id: 'tw-resp', title: 'Responsive Design' },
      { id: 'tw-layout', title: 'Flexbox & Grid' },
      { id: 'tw-state', title: 'States (Hover, Focus)' },
      { id: 'tw-dark', title: 'Dark Mode Setup' },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    category: 'python',
    children: [
      { id: 'py-basics', title: 'Intro & Syntax' },
      { id: 'py-vars', title: 'Variables, Datatypes, Operators' },
      { id: 'py-flow', title: 'Control Flow & Loops' },
      { id: 'py-funcs', title: 'Functions & Modules' },
      { id: 'py-files', title: 'File Handling' },
      { id: 'py-async', title: 'Async Programming' },
    ],
  },
  {
    id: 'python-adv',
    title: 'Python Advanced',
    category: 'python',
    children: [
      { id: 'py-oop', title: 'Object Oriented Programming' },
      { id: 'py-regex', title: 'Regex' },
      { id: 'py-test', title: 'Testing with Pytest' },
    ],
  },
  {
    id: 'db',
    title: 'Database',
    category: 'db',
    children: [
      { id: 'db-sql', title: 'SQL Basics' },
      { id: 'db-sqlite', title: 'SQLite with Python' },
      { id: 'db-mysql', title: 'MySQL with Python' },
      { id: 'db-mongo', title: 'MongoDB Intro' },
    ],
  },
  {
    id: 'django',
    title: 'Django Framework',
    category: 'backend',
    children: [
      { id: 'dj-setup', title: 'Setup' },
      { id: 'dj-orm', title: 'Models & ORM' },
      { id: 'dj-forms', title: 'Built-in Forms' },
      { id: 'dj-auth', title: 'Authentication & Social Login' },
      { id: 'dj-sec', title: 'Security (OWASP)' },
    ],
  },
  {
    id: 'drf',
    title: 'Django REST Framework',
    category: 'backend',
    children: [
      { id: 'drf-ser', title: 'Serializers' },
      { id: 'drf-view', title: 'Views & Endpoints' },
      { id: 'drf-jwt', title: 'JWT / OAuth2' },
      { id: 'drf-test', title: 'API Testing' },
    ],
  },
  {
    id: 'fastapi',
    title: 'FastAPI',
    category: 'backend',
    children: [
      { id: 'fa-async', title: 'Async Routes' },
      { id: 'fa-pydantic', title: 'Pydantic Models' },
      { id: 'fa-redis', title: 'Caching with Redis' },
    ],
  },
  {
    id: 'js',
    title: 'JavaScript',
    category: 'frontend',
    children: [
      { id: 'js-base', title: 'Basics & ES6+' },
      { id: 'js-dom', title: 'DOM Manipulation' },
      { id: 'js-async', title: 'Async/Await & Promises' },
      { id: 'js-api', title: 'Browser APIs & LocalStorage' },
    ],
  },
  {
    id: 'react',
    title: 'React',
    category: 'frontend',
    children: [
      { id: 'r-jsx', title: 'JSX & Components' },
      { id: 'r-hooks', title: 'Hooks (useState, useEffect)' },
      { id: 'r-state', title: 'State & Props' },
      { id: 'r-redux', title: 'Redux Toolkit' },
      { id: 'r-router', title: 'React Router' },
      { id: 'r-axios', title: 'Axios & API calls' },
    ],
  },
  {
    id: 'hosting',
    title: 'Hosting & Deployment',
    category: 'devops',
    children: [
      { id: 'aws', title: 'AWS' },
      { id: 'vercel', title: 'Vercel' },
      { id: 'render', title: 'Render' },
    ],
  },
  {
    id: 'ai-ml',
    title: 'Add-On (AI & ML)',
    category: 'python',
    children: [
      { id: 'ai-numpy', title: 'NumPy & Pandas' },
      { id: 'ai-openai', title: 'OpenAI API' },
      { id: 'ai-lang', title: 'LangChain' },
      { id: 'ai-cv', title: 'OpenCV & Face Detection' },
    ],
  },
];

// --- MERN SYLLABUS ---
export const mernSyllabus = [
  {
    id: 'mern-intro',
    title: 'Introduction to Web Development',
    category: 'general',
    children: [
      { id: 'web-fs-what', title: 'What is Full-stack?' },
      { id: 'web-works', title: 'How Websites Work' },
    ],
  },
  {
    id: 'mern-vcs',
    title: 'Version Control (VCS)',
    category: 'devops',
    children: [
      { id: 'git-intro', title: 'Git & GitHub Basics' },
      { id: 'git-install', title: 'Installing & Config' },
      { id: 'git-cmds', title: 'Basic Commands (add, commit, push)' },
      { id: 'git-repo', title: 'Managing Repositories' },
    ],
  },
  {
    id: 'mern-html',
    title: 'HTML',
    category: 'frontend',
    children: [
      { id: 'html-struct', title: 'Page Structure' },
      { 
          id: 'html-basic-tags', 
          title: 'Basic Tags',
          children: [
             { id: 'tag-headings', title: 'Headings (h1-h6)' },
             { id: 'tag-para', title: 'Paragraphs & Text' },
             { id: 'tag-div', title: 'Div & Span' }
          ]
      },
      { 
          id: 'html-list-img', 
          title: 'Lists & Media',
          children: [
              { id: 'tag-list', title: 'Lists (ul, ol, dl)' },
              { id: 'tag-img', title: 'Images & Figures' },
              { id: 'tag-av', title: 'Audio & Video' },
              { id: 'tag-svg', title: 'SVG Basics' }
          ]
      },
      { 
          id: 'html-forms-group', 
          title: 'Forms',
          children: [
              { id: 'form-structure', title: 'Form Tag & Attributes' },
              { id: 'form-inputs', title: 'Input Types (text, password, email, checkbox)' },
              { id: 'form-elements', title: 'Labels, Select, Textarea' },
              { id: 'form-validation', title: 'HTML5 Validation' }
          ]
      },
      {
          id: 'html-tables-group',
          title: 'Tables',
          children: [
             { id: 'table-row-col', title: 'Rows & Columns' },
             { id: 'table-head-body', title: 'Thead, Tbody' }
          ]
      },
      { 
          id: 'html-sem-seo', 
          title: 'Semantic HTML & SEO',
          children: [
             { id: 'sem-main', title: 'Header, Footer, Main, Nav' },
             { id: 'sem-sec', title: 'Section, Article, Aside' },
             { id: 'seo-meta', title: 'Meta Tags for SEO' },
             { id: 'aria', title: 'ARIA Attributes' }
          ] 
      },
    ],
  },
  {
    id: 'mern-css',
    title: 'CSS',
    category: 'frontend',
    children: [
      { id: 'css-select', title: 'Selectors & Specificity' },
      { 
          id: 'css-box-model', 
          title: 'Box Model',
          children: [
              { id: 'box-margin', title: 'Margin & Padding' },
              { id: 'box-border', title: 'Borders' },
              { id: 'box-sizing', title: 'Box Sizing' }
          ]
      },
      { 
          id: 'css-flex-group', 
          title: 'Flexbox',
          children: [
             { id: 'fl-dir', title: 'Direction & Wrap' },
             { id: 'fl-align', title: 'Align Items & Justify Content' },
             { id: 'fl-grow', title: 'Flex Grow & Shrink' }
          ]
      },
      { 
          id: 'css-grid-group', 
          title: 'Grid',
          children: [
             { id: 'gr-cols', title: 'Grid Columns & Rows' },
             { id: 'gr-gap', title: 'Grid Gap' },
             { id: 'gr-areas', title: 'Grid Areas' }
          ]
      },
      { 
          id: 'css-adv', 
          title: 'Advanced CSS',
          children: [
             { id: 'pseudo', title: 'Pseudo-classes & Elements' },
             { id: 'transforms', title: 'Transforms & Transitions' },
             { id: 'animations', title: 'Keyframe Animations' },
             { id: 'tooltips', title: 'Creating Tooltips' }
          ]
      },
      { id: 'css-media', title: 'Media Queries & Responsive' },
    ],
  },
  {
    id: 'mern-tailwind',
    title: 'Tailwind CSS',
    category: 'frontend',
    children: [
      { id: 'tw-install', title: 'Installation (Vite/Next.js)' },
      { id: 'tw-utils', title: 'Utility Classes' },
      { id: 'tw-layout', title: 'Layout & Positioning' },
      { id: 'tw-comp', title: 'Components & Reusability' },
      { id: 'tw-config', title: 'Custom Configuration' },
    ],
  },
  {
    id: 'mern-js',
    title: 'JavaScript',
    category: 'frontend',
    children: [
      { 
          id: 'js-core', 
          title: 'Core Concepts',
          children: [
              { id: 'js-vars', title: 'Var, Let, Const' },
              { id: 'js-types', title: 'Data Types & Strings' },
              { id: 'js-ops', title: 'Operators' }
          ]
      },
      { id: 'js-flow', title: 'Control Flow (If, Switch, Loops)' },
      { 
          id: 'js-func-group', 
          title: 'Functions',
          children: [
             { id: 'js-decl', title: 'Declaration vs Expression' },
             { id: 'js-arrow', title: 'Arrow Functions' },
             { id: 'js-cb', title: 'Callback Functions' }
          ]
      },
      { 
          id: 'js-struct', 
          title: 'Data Structures',
          children: [
             { id: 'js-arr', title: 'Arrays & Methods (map, filter)' },
             { id: 'js-obj', title: 'Objects & Destructuring' }
          ]
      },
      { 
          id: 'js-dom-group', 
          title: 'DOM Manipulation',
          children: [
              { id: 'dom-sel', title: 'Selecting Elements' },
              { id: 'dom-ev', title: 'Event Listeners' },
              { id: 'dom-mod', title: 'Modifying Classes/Styles' }
          ]
      },
      { 
          id: 'js-async-group', 
          title: 'Async JavaScript',
          children: [
              { id: 'as-prom', title: 'Promises' },
              { id: 'as-await', title: 'Async / Await' },
              { id: 'as-fetch', title: 'Fetch API' }
          ]
      },
      { id: 'js-es6', title: 'ES6+ Features (Modules, Spread)' },
      { id: 'js-storage', title: 'LocalStorage, Session, Cookies' },
      { id: 'js-ts', title: 'Intro to TypeScript' },
    ],
  },
  {
    id: 'mern-db',
    title: 'Database (MongoDB)',
    category: 'db',
    children: [
      { id: 'mongo-intro', title: 'Intro & Installation' },
      { 
          id: 'mongo-crud-group', 
          title: 'CRUD Operations',
          children: [
             { id: 'db-create', title: 'Insert Documents' },
             { id: 'db-read', title: 'Find & Queries' },
             { id: 'db-update', title: 'Update & Delete' }
          ]
      },
      { id: 'mongo-model', title: 'Data Modeling (Schema)' },
      { id: 'mongo-agg', title: 'Aggregation Framework' },
    ],
  },
  {
    id: 'mern-node',
    title: 'Node.js',
    category: 'backend',
    children: [
      { id: 'node-npm', title: 'NPM & package.json' },
      { id: 'node-server', title: 'Creating HTTP Server' },
      { id: 'node-fs', title: 'File System (fs module)' },
      { id: 'node-stream', title: 'Streams & Buffers' },
    ],
  },
  {
    id: 'mern-express',
    title: 'Express.js',
    category: 'backend',
    children: [
      { id: 'exp-route', title: 'Routing & Methods (GET, POST)' },
      { 
          id: 'exp-mid-group', 
          title: 'Middleware',
          children: [
             { id: 'mid-app', title: 'Application Level' },
             { id: 'mid-err', title: 'Error Handling' },
             { id: 'mid-builtin', title: 'Built-in (static, json)' }
          ]
      },
      { id: 'exp-api', title: 'REST API Architecture' },
      { id: 'exp-auth', title: 'Authentication (JWT)' },
      { id: 'exp-db', title: 'Mongoose Integration' },
    ],
  },
  {
    id: 'mern-react',
    title: 'React.js',
    category: 'frontend',
    children: [
      { id: 'react-base', title: 'JSX & Virtual DOM' },
      { 
          id: 'react-comp', 
          title: 'Components',
          children: [
             { id: 'comp-func', title: 'Functional Components' },
             { id: 'comp-props', title: 'Props' },
             { id: 'comp-cond', title: 'Conditional Rendering' }
          ]
      },
      { 
          id: 'react-hooks-group', 
          title: 'Hooks',
          children: [
             { id: 'hook-state', title: 'useState' },
             { id: 'hook-effect', title: 'useEffect' },
             { id: 'hook-ref', title: 'useRef' },
             { id: 'hook-custom', title: 'Custom Hooks' }
          ]
      },
      { id: 'react-router', title: 'React Router (v6)' },
      { id: 'react-redux', title: 'State Management (Redux/Context)' },
      { id: 'react-forms', title: 'Handling Forms' },
      { id: 'react-api', title: 'API Calls (Axios)' },
    ],
  },
  {
    id: 'mern-deploy',
    title: 'Hosting & Deployment',
    category: 'devops',
    children: [
      { id: 'deploy-fe', title: 'Frontend (Vercel/Netlify)' },
      { id: 'deploy-be', title: 'Backend (Render/AWS)' },
      { id: 'deploy-ci', title: 'CI/CD Basics' },
    ],
  },
];

// --- COURSES METADATA ---
export const courses = [
  {
    id: 'mern',
    title: 'MERN Stack Mastery',
    description: 'Full-stack development with MongoDB, Express, React, and Node.js. Build modern web apps.',
    icon: 'react',
    data: mernSyllabus
  },
  {
    id: 'python-fs',
    title: 'Python Fullstack',
    description: 'Master Python, Django, FastAPI and modern frontend tools. Perfect for enterprise development.',
    icon: 'python',
    data: pythonSyllabus
  },
  {
    id: 'devops',
    title: 'DevOps Engineering',
    description: 'Coming Soon: Docker, Kubernetes, CI/CD pipelines, and Cloud Infrastructure.',
    icon: 'code',
    data: [] // Placeholder
  },
];
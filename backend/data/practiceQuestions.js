const practiceQuestions = [
  // React
  {
    question: "What is the primary purpose of the Virtual DOM in React?",
    options: ["To directly manipulate the browser DOM", "To increase memory usage", "To optimize rendering performance by minimizing actual DOM updates", "To create virtual reality interfaces"],
    correctAnswer: "To optimize rendering performance by minimizing actual DOM updates",
    explanation: "The Virtual DOM is a lightweight copy of the real DOM. React updates it first, compares it with the real DOM, and batches necessary updates to improve performance.",
    topic: "React",
    difficulty: "Medium"
  },
  {
    question: "Which hook is used to perform side effects in functional components?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: "useEffect",
    explanation: "useEffect is used to manage side effects like data fetching, subscriptions, or manually changing the DOM.",
    topic: "React",
    difficulty: "Easy"
  },
  {
    question: "What is 'prop drilling' in React?",
    options: ["A tool used to drill holes in UI components", "Passing data from a parent component down to a deeply nested child component through intermediate components", "A method for fetching API data", "A testing technique"],
    correctAnswer: "Passing data from a parent component down to a deeply nested child component through intermediate components",
    explanation: "Prop drilling refers to the process of passing props through multiple layers of components that do not need the data themselves, just to reach a deeply nested component.",
    topic: "React",
    difficulty: "Medium"
  },
  {
    question: "How does React handle state updates inside asynchronous callbacks like setTimeout?",
    options: ["React batches them automatically in React 18+", "React ignores them", "React crashes", "They must always be synchronous"],
    correctAnswer: "React batches them automatically in React 18+",
    explanation: "Since React 18, React automatically batches state updates inside asynchronous callbacks, such as promises or timeouts, to prevent unnecessary re-renders.",
    topic: "React",
    difficulty: "Hard"
  },
  // JavaScript
  {
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["Undefined", "Number", "Boolean", "Float"],
    correctAnswer: "Float",
    explanation: "JavaScript has only one type of number ('Number'), which represents both integers and floating-point values.",
    topic: "JavaScript",
    difficulty: "Easy"
  },
  {
    question: "What does 'closure' mean in JavaScript?",
    options: ["Closing the browser window", "A function bundled together with its lexical environment", "A method to delete variables", "An error handling mechanism"],
    correctAnswer: "A function bundled together with its lexical environment",
    explanation: "A closure is a function that remembers the variables from the lexical scope in which it was created, even after that scope has finished executing.",
    topic: "JavaScript",
    difficulty: "Medium"
  },
  {
    question: "What is the output of 'typeof null' in JavaScript?",
    options: ["'null'", "'object'", "'undefined'", "'string'"],
    correctAnswer: "'object'",
    explanation: "This is a well-known historical bug in JavaScript where typeof null incorrectly returns 'object'.",
    topic: "JavaScript",
    difficulty: "Medium"
  },
  {
    question: "Explain the difference between '==' and '===' in JavaScript.",
    options: ["They are identical", "'==' checks value and type, '===' checks only value", "'==' performs type coercion, '===' checks both value and type", "'===' performs type coercion"],
    correctAnswer: "'==' performs type coercion, '===' checks both value and type",
    explanation: "The strict equality operator (===) checks both value and type without converting them, whereas loose equality (==) coerces types before comparing.",
    topic: "JavaScript",
    difficulty: "Easy"
  },
  {
    question: "What is the event loop in JavaScript?",
    options: ["A loop that repeats animations", "A mechanism that handles asynchronous callbacks and promises", "A synchronous while loop", "A design pattern for objects"],
    correctAnswer: "A mechanism that handles asynchronous callbacks and promises",
    explanation: "The event loop continuously checks the call stack and the message queue, pushing asynchronous callbacks onto the stack when it is empty.",
    topic: "JavaScript",
    difficulty: "Hard"
  },
  // Node.js
  {
    question: "What is Node.js built on?",
    options: ["SpiderMonkey", "V8 JavaScript engine", "Chakra", "JavaScriptCore"],
    correctAnswer: "V8 JavaScript engine",
    explanation: "Node.js is built on Google Chrome's highly optimized V8 JavaScript engine.",
    topic: "Node.js",
    difficulty: "Easy"
  },
  {
    question: "Which core module in Node.js provides utilities for working with file and directory paths?",
    options: ["fs", "path", "os", "http"],
    correctAnswer: "path",
    explanation: "The 'path' module provides utilities for handling and transforming file paths.",
    topic: "Node.js",
    difficulty: "Medium"
  },
  {
    question: "Is Node.js single-threaded or multi-threaded?",
    options: ["Multi-threaded", "Single-threaded with an event-driven architecture", "No threads are used", "It depends on the OS"],
    correctAnswer: "Single-threaded with an event-driven architecture",
    explanation: "Node.js runs its JavaScript code in a single thread but delegates blocking I/O operations to worker threads via libuv.",
    topic: "Node.js",
    difficulty: "Medium"
  },
  // Express.js
  {
    question: "What is middleware in Express.js?",
    options: ["A database ORM", "A frontend framework", "Functions that have access to the request and response object", "A method for deploying apps"],
    correctAnswer: "Functions that have access to the request and response object",
    explanation: "Middleware functions can execute any code, make changes to the request/response objects, end the response cycle, or call the next middleware.",
    topic: "Express.js",
    difficulty: "Medium"
  },
  {
    question: "How do you handle errors centrally in an Express.js application?",
    options: ["Using a try-catch in every route", "Using a middleware function with 4 arguments (err, req, res, next)", "By checking res.error", "Using window.onerror"],
    correctAnswer: "Using a middleware function with 4 arguments (err, req, res, next)",
    explanation: "Express recognizes a middleware function as an error handler if it takes exactly four arguments: (err, req, res, next).",
    topic: "Express.js",
    difficulty: "Hard"
  },
  // MongoDB / DBMS
  {
    question: "Which of the following describes MongoDB?",
    options: ["Relational Database", "NoSQL Document Database", "Graph Database", "Key-Value Store"],
    correctAnswer: "NoSQL Document Database",
    explanation: "MongoDB stores data in flexible, JSON-like documents, making it a document-oriented NoSQL database.",
    topic: "MongoDB",
    difficulty: "Easy"
  },
  {
    question: "What does ACID stand for in database systems?",
    options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Completeness, Integrity, Data", "Association, Connectivity, Isolation, Dependency", "Array, Class, Interface, Document"],
    correctAnswer: "Atomicity, Consistency, Isolation, Durability",
    explanation: "ACID properties ensure reliable processing of database transactions.",
    topic: "DBMS",
    difficulty: "Medium"
  },
  {
    question: "What is the purpose of an index in a database?",
    options: ["To delete data automatically", "To improve the speed of data retrieval operations", "To encrypt the database", "To validate JSON schemas"],
    correctAnswer: "To improve the speed of data retrieval operations",
    explanation: "Indexes are special data structures that store a small portion of the data set in an easy-to-traverse form, vastly speeding up queries.",
    topic: "DBMS",
    difficulty: "Medium"
  },
  {
    question: "What is an aggregation pipeline in MongoDB?",
    options: ["A framework for data aggregation modeled on the concept of data processing pipelines", "A method to backup data", "A tool for user authentication", "A way to join SQL tables"],
    correctAnswer: "A framework for data aggregation modeled on the concept of data processing pipelines",
    explanation: "Documents enter a multi-stage pipeline that transforms them into aggregated results.",
    topic: "MongoDB",
    difficulty: "Hard"
  },
  // HTML / CSS
  {
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Multi Language"],
    correctAnswer: "HyperText Markup Language",
    explanation: "HTML is the standard markup language for documents designed to be displayed in a web browser.",
    topic: "HTML",
    difficulty: "Easy"
  },
  {
    question: "Which property is used in CSS to change the background color?",
    options: ["bgcolor", "color", "background-color", "bg-color"],
    correctAnswer: "background-color",
    explanation: "The background-color property sets the background color of an element.",
    topic: "CSS",
    difficulty: "Easy"
  },
  {
    question: "What is the difference between 'display: none' and 'visibility: hidden'?",
    options: ["They are identical", "'display: none' removes the element from the document flow; 'visibility: hidden' leaves the space intact", "'visibility: hidden' removes the element from the flow", "Neither removes the element from the flow"],
    correctAnswer: "'display: none' removes the element from the document flow; 'visibility: hidden' leaves the space intact",
    explanation: "An element with display: none takes up no space, while visibility: hidden makes the element invisible but still takes up its original space.",
    topic: "CSS",
    difficulty: "Medium"
  },
  {
    question: "What is the CSS box model?",
    options: ["A layout model determining how elements are sized and spaced", "A tool for creating 3D boxes", "A framework for drawing shapes", "A JavaScript library"],
    correctAnswer: "A layout model determining how elements are sized and spaced",
    explanation: "The CSS box model consists of margins, borders, padding, and the actual content area.",
    topic: "CSS",
    difficulty: "Easy"
  },
  // SQL
  {
    question: "Which SQL statement is used to extract data from a database?",
    options: ["EXTRACT", "SELECT", "GET", "OPEN"],
    correctAnswer: "SELECT",
    explanation: "The SELECT statement is used to select data from a database.",
    topic: "SQL",
    difficulty: "Easy"
  },
  {
    question: "What does a LEFT JOIN do?",
    options: ["Returns all records from the right table", "Returns all records from the left table, and the matched records from the right table", "Returns only records with matches in both tables", "Deletes the left table"],
    correctAnswer: "Returns all records from the left table, and the matched records from the right table",
    explanation: "A LEFT JOIN preserves all rows of the left table regardless of whether there is a match in the right table.",
    topic: "SQL",
    difficulty: "Medium"
  },
  // Data Structures & Algorithms
  {
    question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(log n)",
    explanation: "In a balanced BST, each comparison halves the remaining search space, resulting in logarithmic time complexity.",
    topic: "Data Structures",
    difficulty: "Medium"
  },
  {
    question: "Which data structure is primarily used for Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Hash Table", "Linked List"],
    correctAnswer: "Queue",
    explanation: "BFS explores neighbors level by level, which requires a First-In-First-Out (FIFO) structure like a Queue.",
    topic: "Algorithms",
    difficulty: "Medium"
  },
  {
    question: "What is a Hash Collision?",
    options: ["When a hash table runs out of memory", "When two different inputs produce the same hash value", "When a hash function crashes", "When data is encrypted twice"],
    correctAnswer: "When two different inputs produce the same hash value",
    explanation: "A collision occurs because the hash space is usually smaller than the key space, mapping multiple keys to the same bucket.",
    topic: "Data Structures",
    difficulty: "Hard"
  },
  {
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n)", "O(n^2)", "O(1)"],
    correctAnswer: "O(n^2)",
    explanation: "If the pivot chosen is always the maximum or minimum element, the array is partitioned highly unevenly, resulting in O(n^2) time.",
    topic: "Algorithms",
    difficulty: "Medium"
  },
  // JWT / Authentication
  {
    question: "What are the three parts of a JSON Web Token (JWT)?",
    options: ["Header, Body, Footer", "Header, Payload, Signature", "Token, Secret, ID", "User, Password, Hash"],
    correctAnswer: "Header, Payload, Signature",
    explanation: "A JWT consists of three parts separated by dots: a Header, a Payload (claims), and a Signature.",
    topic: "JWT",
    difficulty: "Medium"
  },
  {
    question: "Where should JWTs be stored in a web application to minimize XSS risks?",
    options: ["LocalStorage", "SessionStorage", "HttpOnly Cookies", "URL Parameters"],
    correctAnswer: "HttpOnly Cookies",
    explanation: "HttpOnly cookies cannot be accessed via JavaScript, providing protection against Cross-Site Scripting (XSS) attacks.",
    topic: "Authentication",
    difficulty: "Hard"
  },
  // General Software Engineering
  {
    question: "What does REST stand for?",
    options: ["Representational State Transfer", "Responsive Engine State Transfer", "Resource Execution Standard Technology", "Robust Entity System Transfer"],
    correctAnswer: "Representational State Transfer",
    explanation: "REST is an architectural style that defines a set of constraints for creating web services.",
    topic: "REST API",
    difficulty: "Easy"
  },
  {
    question: "What is the primary purpose of version control systems like Git?",
    options: ["To format code", "To deploy applications", "To track changes in source code and collaborate", "To run unit tests"],
    correctAnswer: "To track changes in source code and collaborate",
    explanation: "Version control tracks modifications to code over time, allowing teams to collaborate safely.",
    topic: "Git",
    difficulty: "Easy"
  },
  {
    question: "What is a merge conflict in Git?",
    options: ["When two branches contain changes to the same lines of a file", "When a file is deleted", "When a pull request is approved", "When the server goes down"],
    correctAnswer: "When two branches contain changes to the same lines of a file",
    explanation: "Git cannot automatically determine which changes to keep, requiring manual intervention to resolve the conflict.",
    topic: "Git",
    difficulty: "Medium"
  },
  {
    question: "What does OOP stand for?",
    options: ["Object-Oriented Programming", "Only Object Processing", "Overly Optimized Protocols", "Object-Oriented Procedures"],
    correctAnswer: "Object-Oriented Programming",
    explanation: "OOP is a programming paradigm based on the concept of 'objects', which can contain data and code.",
    topic: "OOP",
    difficulty: "Easy"
  },
  {
    question: "Which of the following is NOT one of the 4 pillars of OOP?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    correctAnswer: "Compilation",
    explanation: "The four pillars of OOP are Abstraction, Encapsulation, Inheritance, and Polymorphism.",
    topic: "OOP",
    difficulty: "Medium"
  },
  // Computer Networks
  {
    question: "What is the main function of the DNS?",
    options: ["To secure network traffic", "To translate domain names to IP addresses", "To assign IP addresses to devices", "To block malicious traffic"],
    correctAnswer: "To translate domain names to IP addresses",
    explanation: "The Domain Name System (DNS) acts as the phonebook of the Internet, translating human-readable domain names into IP addresses.",
    topic: "Computer Networks",
    difficulty: "Medium"
  },
  {
    question: "Which protocol is used for secure communication over a computer network?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: "HTTPS",
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts HTTP requests and responses, usually via TLS.",
    topic: "Computer Networks",
    difficulty: "Easy"
  },
  {
    question: "In the OSI model, which layer is responsible for routing packets?",
    options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
    correctAnswer: "Network Layer",
    explanation: "The Network Layer (Layer 3) handles the routing of data packets between devices across multiple networks.",
    topic: "Computer Networks",
    difficulty: "Hard"
  },
  // Operating Systems
  {
    question: "What is a thread in an operating system?",
    options: ["A hardware component", "The smallest sequence of programmed instructions that can be managed independently", "A complete process", "A type of memory segment"],
    correctAnswer: "The smallest sequence of programmed instructions that can be managed independently",
    explanation: "A thread is a lightweight process; a single process can have multiple threads sharing the same memory space.",
    topic: "Operating Systems",
    difficulty: "Medium"
  },
  {
    question: "What is a deadlock?",
    options: ["When a computer is turned off", "When two or more processes are unable to proceed because each is waiting for the other to release a resource", "When memory is fully utilized", "When a process completes successfully"],
    correctAnswer: "When two or more processes are unable to proceed because each is waiting for the other to release a resource",
    explanation: "Deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.",
    topic: "Operating Systems",
    difficulty: "Hard"
  },
  // Python
  {
    question: "How do you create a dictionary in Python?",
    options: ["[]", "{}", "()", "<>"],
    correctAnswer: "{}",
    explanation: "In Python, dictionaries are created using curly braces {}, containing key-value pairs.",
    topic: "Python",
    difficulty: "Easy"
  },
  {
    question: "What does the 'yield' keyword do in Python?",
    options: ["Stops a loop", "Returns a value and suspends the function's execution to create a generator", "Throws an exception", "Imports a module"],
    correctAnswer: "Returns a value and suspends the function's execution to create a generator",
    explanation: "yield pauses the function saving all its states, and later continues from there on successive calls.",
    topic: "Python",
    difficulty: "Medium"
  },
  {
    question: "What is PEP 8?",
    options: ["A Python web framework", "Python's style guide for writing readable code", "A package manager", "A database connector"],
    correctAnswer: "Python's style guide for writing readable code",
    explanation: "PEP 8 provides guidelines and best practices on how to write Python code.",
    topic: "Python",
    difficulty: "Easy"
  },
  // Java
  {
    question: "What is the JVM?",
    options: ["Java Virtual Machine", "Java Variable Method", "Java Visual Monitor", "Java Value Matrix"],
    correctAnswer: "Java Virtual Machine",
    explanation: "The JVM is an engine that provides a runtime environment to drive the Java Code or applications.",
    topic: "Java",
    difficulty: "Easy"
  },
  {
    question: "What does 'public static void main(String[] args)' represent in Java?",
    options: ["A constructor", "The entry point of a Java program", "A garbage collection mechanism", "An interface declaration"],
    correctAnswer: "The entry point of a Java program",
    explanation: "This signature is required for the JVM to start the execution of a Java application.",
    topic: "Java",
    difficulty: "Medium"
  },
  {
    question: "Which keyword is used to prevent a class from being inherited in Java?",
    options: ["static", "abstract", "final", "private"],
    correctAnswer: "final",
    explanation: "When a class is declared as final, it cannot be extended by any other class.",
    topic: "Java",
    difficulty: "Medium"
  },
  // C
  {
    question: "What is a pointer in C?",
    options: ["A variable that stores a memory address", "A function that returns an integer", "A global constant", "A keyword for looping"],
    correctAnswer: "A variable that stores a memory address",
    explanation: "Pointers hold the memory address of another variable, allowing direct memory manipulation.",
    topic: "C",
    difficulty: "Medium"
  },
  {
    question: "What is the size of an 'int' data type in C on a typical 32-bit system?",
    options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
    correctAnswer: "4 bytes",
    explanation: "On modern 32-bit and 64-bit architectures, an 'int' usually occupies 4 bytes (32 bits).",
    topic: "C",
    difficulty: "Easy"
  },
  // More questions to guarantee robust practice sizes
  {
    question: "What is the purpose of 'useMemo' in React?",
    options: ["To memoize a component", "To memoize an expensive calculation so it is not re-computed on every render", "To fetch data", "To memorize state values permanently"],
    correctAnswer: "To memoize an expensive calculation so it is not re-computed on every render",
    explanation: "useMemo caches the result of a calculation between renders, improving performance.",
    topic: "React",
    difficulty: "Hard"
  },
  {
    question: "What is a Promise in JavaScript?",
    options: ["A keyword for defining variables", "An object representing the eventual completion or failure of an asynchronous operation", "A synchronous loop", "A design pattern for creating classes"],
    correctAnswer: "An object representing the eventual completion or failure of an asynchronous operation",
    explanation: "A Promise is a proxy for a value not necessarily known when the promise is created.",
    topic: "JavaScript",
    difficulty: "Medium"
  },
  {
    question: "What does 'sudo' stand for in Unix-like OS?",
    options: ["Superuser do", "System Update Download Object", "Switch User Document Open", "Super User Database Object"],
    correctAnswer: "Superuser do",
    explanation: "sudo allows a permitted user to execute a command as the superuser or another user.",
    topic: "Operating Systems",
    difficulty: "Easy"
  },
  {
    question: "Which TCP port is used by default for HTTP traffic?",
    options: ["21", "22", "80", "443"],
    correctAnswer: "80",
    explanation: "Port 80 is the standard port for unencrypted HTTP traffic.",
    topic: "Computer Networks",
    difficulty: "Easy"
  },
  {
    question: "What is a Foreign Key in SQL?",
    options: ["A primary key in the same table", "A column or group of columns that provides a link between data in two tables", "A key used to encrypt passwords", "A unique identifier for a row"],
    correctAnswer: "A column or group of columns that provides a link between data in two tables",
    explanation: "A foreign key is a field (or collection of fields) in one table, that refers to the PRIMARY KEY in another table.",
    topic: "SQL",
    difficulty: "Medium"
  },
  {
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interaction", "Application Performance Index"],
    correctAnswer: "Application Programming Interface",
    explanation: "An API is a set of rules and protocols for building and interacting with software applications.",
    topic: "Software Engineering",
    difficulty: "Easy"
  },
  {
    question: "What is continuous integration (CI)?",
    options: ["Deploying code manually", "The practice of merging all developers' working copies to a shared mainline several times a day", "Testing code only before a major release", "Writing code without version control"],
    correctAnswer: "The practice of merging all developers' working copies to a shared mainline several times a day",
    explanation: "CI is a software development practice where developers regularly merge their code changes into a central repository, after which automated builds and tests are run.",
    topic: "Software Engineering",
    difficulty: "Medium"
  },
  {
    question: "Which of these is a NoSQL database?",
    options: ["PostgreSQL", "MySQL", "Cassandra", "Oracle"],
    correctAnswer: "Cassandra",
    explanation: "Apache Cassandra is a highly scalable, distributed NoSQL database.",
    topic: "DBMS",
    difficulty: "Medium"
  },
  {
    question: "In Python, which built-in function returns the length of a list?",
    options: ["length()", "len()", "size()", "count()"],
    correctAnswer: "len()",
    explanation: "The len() function returns the number of items in an object.",
    topic: "Python",
    difficulty: "Easy"
  },
  {
    question: "In Git, how do you save your local changes without committing them?",
    options: ["git save", "git hold", "git stash", "git preserve"],
    correctAnswer: "git stash",
    explanation: "git stash temporarily shelves changes you've made to your working copy so you can work on something else.",
    topic: "Git",
    difficulty: "Medium"
  },
  {
    question: "What is Big O notation?",
    options: ["A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity", "A way to define variables in Python", "A network protocol", "A database indexing algorithm"],
    correctAnswer: "A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity",
    explanation: "In computer science, Big O notation is used to classify algorithms according to how their run time or space requirements grow as the input size grows.",
    topic: "Algorithms",
    difficulty: "Medium"
  }
];

module.exports = practiceQuestions;

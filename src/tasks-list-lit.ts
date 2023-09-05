import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tasks-list-lit')
export class TasksListLit extends LitElement {
  @property({ type: String }) header = `Lista de Tareas`;
  @property({ type: Array }) tasks: string[] = [];
  @property({ type: Array }) completedTasks: string[] = [];
  @property({ type: String }) newTask = '';
  @property({ type: Array }) taskCreationDates: string[] = [];
  @property({ type: Array }) taskCompletionDates: string[] = [];

  static styles = css`
  :host {
    display: block;
    text-align: center;
    font-family: Arial, sans-serif;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Dos columnas con ancho mínimo de 300px */
    gap: 20px; /* Espacio entre columnas */
    margin: 20px;
  }

  .column {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;
  }

  .column:hover {
    transform: scale(1.02);
  }

  h1, h2 {
    color: #333;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  h1 span {
    color: #00002c;
  }

  .logo {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
  }

  form {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  input[type="text"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }

  button[type="submit"] {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 0;
    width: 100%;
  }

  li {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 5px 0;
    transition: transform 0.2s ease-in-out;
  }

  li:hover {
    transform: scale(1.02);
  }

  .task-date {
    margin-left: auto;
    color: #888;
    font-size: 0.8rem;
  }

  .completed-list {
    background-color: #f0f0f0;
  }

  .text-success {
    color: #28a745;
    transition: transform 0.2s ease-in-out;
    margin-left: 10px;
  }

  .text-danger {
    color: #dc3545;
    transition: transform 0.2s ease-in-out;
    margin-left: 10px;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .text-success:hover,
  .text-danger:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    main {
      grid-template-columns: 1fr; /* Una sola columna en dispositivos móviles */
    }
  }
`;

  render() {
    return html`
      <main>
        <div class="column">
          <h1>${this.header} con Lit</h1>
          <img class="logo" src="../assets/imagenes/lit.png" alt="Logo de la aplicación">
          <form @submit="${this.addTask}">
            <input
              type="text"
              .value="${this.newTask}"
              @input="${this.updateNewTask}"
              placeholder="Nueva tarea"
            />
            <button type="submit" class="btn btn-primary">Agregar</button>
          </form>

          <ul>
            ${this.tasks.map(
              (task, index) => html`
                <li>
                  <span 
                    class="editable" 
                    contenteditable="true" 
                    @blur="${(e:any) => this.editTask(index, e.target.textContent)}"
                  >${task}</span>
                  <span class="task-date">Creado: ${this.taskCreationDates[index]}</span>
                  <span @click="${() => this.completeTask(index)}" class="text-success cursor-pointer">&#x2714;</span>
                  <span @click
                  <span @click="${() => this.deleteTask(index)}" class="text-danger cursor-pointer">&#x2716;</span>
                </li>
              `
            )}
          </ul>
        </div>

        <div class="column completed-list">
          <h2>Tareas Completas</h2>
          <ul>
            ${this.completedTasks.map(
              (task, index) => html`
                <li>
                  ${task}
                  <span class="task-date">Completado: ${this.taskCompletionDates[index]}</span>
                  <span @click="${() => this.deleteCompletedTask(index)}" class="text-danger cursor-pointer">&#x2716;</span>
                </li>
              `
            )}
          </ul>
        </div>
      </main>
    `;
  }

  updateNewTask(e: Event) {
    this.newTask = (e.target as HTMLInputElement).value;
  }

  addTask(e: Event) {
    e.preventDefault();
    if (this.newTask.trim() !== '') {
      this.tasks = [...this.tasks, this.newTask];
      this.taskCreationDates = [...this.taskCreationDates, new Date().toLocaleString()];
      this.newTask = '';
      this.requestUpdate('tasks');
      this.requestUpdate('taskCreationDates');
    }
  }

  editTask(index: number, newText: string) {
    this.tasks[index] = newText;
    this.requestUpdate('tasks');
  }

  completeTask(index: number) {
    const completedTask = this.tasks[index];
    this.completedTasks = [...this.completedTasks, completedTask];
    this.taskCompletionDates = [...this.taskCompletionDates, new Date().toLocaleString()];
    this.tasks.splice(index, 1);
    this.taskCreationDates.splice(index, 1);
    this.requestUpdate('completedTasks');
    this.requestUpdate('taskCompletionDates');
    this.requestUpdate('tasks');
    this.requestUpdate('taskCreationDates');
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.taskCreationDates.splice(index, 1);
    this.requestUpdate('tasks');
    this.requestUpdate('taskCreationDates');
  }

  deleteCompletedTask(index: number) {
    this.completedTasks.splice(index, 1);
    this.taskCompletionDates.splice(index, 1);
    this.requestUpdate('completedTasks');
    this.requestUpdate('taskCompletionDates');
  }
}

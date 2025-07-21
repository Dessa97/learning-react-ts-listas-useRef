import "./styles.css";
import { useEffect, useState, useRef } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [edit, setEdit] = useState({
    enabled: false,
    task: "",
  });
  /*Define que inputRef vai acessar o input diretamente*/
  const inputRef = useRef<HTMLInputElement>(null);
  /*Flag para saber se é a primeira renderização, começa com true*/
  const firstRender = useRef(true);

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoReact");
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  /*Esse useEffect é chamado toda vez que o estado tasks mudar*/
  useEffect(() => {
    /*Se for a primeira renderização do componente, executa este bloco.*/
    if (firstRender.current) {
      /*Marca que a primeira renderização já passou*/
      firstRender.current = false;
      /*Impede o salvamento no localStorage na primeira vez.*/
      return;
    }
    /*Salva as tarefas somente quando tasks mudar, e não for a primeira renderização.*/
    localStorage.setItem("@cursoReact", JSON.stringify(tasks));
  }, [tasks]);

  function handleRegister() {
    if (!input) {
      alert("Adicione uma tarefa!");
      return;
    }
    if (edit.enabled) {
      handleSaveEdit();
      return;
    }
    setTasks((tarefas) => [...tarefas, input]);
    setInput("");
  }

  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex((task) => task === edit.task);
    const allTasks = [...tasks];
    allTasks[findIndexTask] = input;
    setTasks(allTasks);
    setEdit({
      enabled: false,
      task: "",
    });
    setInput("");
  }

  function handleDelete(item: string) {
    const removeTask = tasks.filter((task) => task !== item);
    setTasks(removeTask);
  }

  function handleEdit(item: string) {
    /*Esse comando colocar o cursor no campo de input referenciado por inputRef.*/
    inputRef.current?.focus();
    setInput(item); /*Preenche o imput com o item*/
    setEdit({
      enabled: true /*Indica se está em modo de edição*/,
      task: item /*Tarefa clicada para editar*/,
    });
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <input
        placeholder="Digite o nome da tarefa..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        /*Conecta o input ao inputRef. Assim, podemos manipular o input diretamente usando inputRef.current (ex: focar, pegar valor etc.) */
        ref={inputRef}
      />
      <button onClick={handleRegister}>
        {edit.enabled ? "Atualizar Tarefa" : "Adicionar Tarefa"}{" "}
      </button>
      <hr />

      {tasks.map((item, index) => (
        <section key={item}>
          <span>{item}</span>
          <button onClick={() => handleEdit(item)}>Editar</button>
          <button onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </div>
  );
}

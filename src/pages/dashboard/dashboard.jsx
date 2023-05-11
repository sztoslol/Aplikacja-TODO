import "./dashboard.css";
import Task from "./task/task";

const Dashboard = () => {
    const t = {
        header: "Posegregować papier w toalecie",
        desc: "Musisz posegregować cały papier w toalecie. Nie ma wymówek i trzeba działać. Pozdrawiam D. Sz.",
        dueDate: "24 marzec",
    };
    return <Task header={t.header} desc={t.desc} dueDate={t.dueDate} />;
};

export default Dashboard;

const tasks = [
  "Location management",
  "Booking review",
  "Booking status",
  "User and session administration",
];

export function AdminTaskDashboard() {
  return (
    <section className="section container" aria-labelledby="admin-tasks-title">
      <div className="card adminDashboard">
        <div className="sectionHeading">
          <div>
            <div className="eyebrow">Admin workspace</div>
            <h2 id="admin-tasks-title">Task dashboard</h2>
            <p>Admin access cannot be provided. These operations are read-only and unavailable.</p>
          </div>
        </div>
        <div className="adminTaskTable" role="table" aria-label="Admin task dashboard">
          <div className="adminTaskRow adminTaskHeader" role="row">
            <strong role="columnheader">Task</strong>
            <strong role="columnheader">Status</strong>
            <strong role="columnheader">Action</strong>
          </div>
          {tasks.map((task) => (
            <div className="adminTaskRow" role="row" key={task}>
              <span role="cell">{task}</span>
              <span role="cell" className="muted">Unavailable</span>
              <button type="button" disabled aria-label={`${task}: admin access cannot be provided`}>Admin access unavailable</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import express from "express"; // 모듈이 없기 때문에 안된다
import mysql from "mysql2/promise";
//const express = require("express"); //import로 바꿔서 진행을 해보자

const pool = mysql.createPool({
  host: "localhost",
  user: "hej89",
  password: "hej1022",
  database: "a9",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
const port = 3000;

app.post("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const { reg_date, perform_date, is_completed, content } = req.body;

  if (!reg_date) {
    res.status(400).json({
      msg: "reg_date required",
    });
    return;
  }
  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return;
  }

  if (!is_completed) {
    res.status(400).json({
      msg: "is_completed required",
    });
    return;
  }
  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rows] = await pool.query(
    `INSERT INTO todo SET reg_date = ?, perform_date = ?, is_completed = ?, content = ?`,
    [reg_date, perform_date, is_completed, content]
  );

  res.json({
    msg: `${id}번 할 일이 생성되었습니다.`,
  });
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(`SELECT * FROM todo WHERE id = ?`, [id]);

  const [rs] = await pool.query(`DELETE FROM todo WHERE id = ?`, [id]);

  res.json({
    msg: `${id}번 할 일이 삭제되었습니다.`,
  });
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(`SELECT * FROM todo WHERE id = ?`, [id]);

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const { perform_date, content } = req.body;

  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return;
  }
  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `UPDATE todo SET perform_date = ?, content = ? WHERE id = ?`,
    [perform_date, content, id]
  );

  res.json({
    msg: `${id}번 할 일이 수정되었습니다.`,
  });
});

app.get("/todos/:id", async (req, res) => {
  //const id = req.params.id
  const { id } = req.params;

  const [rows] = await pool.query(`SELECT * FROM todo WHERE id = ?`, [id]);

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
  res.json(rows);
});

app.get("/todos", async (req, res) => {
  const [rows] = await pool.query(`SELECT * FROM todo ORDER BY id DESC`);
  res.json(rows);
});

app.listen(port);

// 라우팅의 개념을 설명
//성공!!//

// ctrl + c = 종료(동시에 서버도 꺼지기 때문에 다시 node app.js를 통해 켜주어야 한다)
//매번 node app.js를 타이핑해서 켜주기가 불편하다. 자동으로 저장되면 켜줄수 있게 하고싶다

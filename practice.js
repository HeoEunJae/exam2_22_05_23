//const express = require("express");
import express from "express";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "hej89",
  password: "hej1022",
  database: "pr",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
const port = 3001;
//================================== 생 성 =========================================
app.post("/prs/:id", async (req, res) => {
  const { id } = req.params;

  const { regDate, content } = req.body;

  if (!regDate) {
    res.status(404).json({
      msg: "regDate found",
    });
    return;
  }

  if (!content) {
    res.status(404).json({
      msg: "content found",
    });
    return;
  }

  const [rows] = await pool.query(
    `
  INSERT INTO gpudp
  SET regDate = ?,
  content = ?
  `,
    [regDate, content]
  );

  res.json({
    msg: `${id}번 할 일이 생성되었습니다.`,
  });
});
//================================== 삭 제 =========================================
app.delete("/prs/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
  SELECT *
  FROM gpudp
  WHERE id = ?
  `,
    [id]
  );

  if (rows == null) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    DELETE FROM gpudp
    WHERE id = ?
    `,
    [id]
  );

  res.json({
    msg: `${id}번 할 일이 삭제되었습니다.`,
  });
});
//================================== 수 정 =========================================
app.patch("/prs/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
  SELECT *
  FROM gpudp
  WHERE id = ?
  `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const { regDate, content } = req.body;

  if (!regDate) {
    res.status(400).json({
      msg: "regDate fail",
    });
    return;
  }
  if (!content) {
    res.status(400).json({
      msg: "content fail",
    });
  }

  const [rs] = await pool.query(
    `
    UPDATE gpudp
    SET regDate = ?,
    content = ?
    WHERE id = ?
    `,
    [regDate, content, id]
  );

  res.json({
    msg: `${id}번 할 일이 수정되었습니다.`,
  });
});
//================================ 단건 조회 ========================================
app.get("/prs/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
  SELECT *
  FROM gpudp
  WHERE id = ?
  `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
  res.json(rows);
});

//=================================== 조 회 ========================================
app.get("/prs", async (req, res) => {
  const [rows] = await pool.query(
    `
  SELECT *
  FROM gpudp
  ORDER BY id
  DESC  
  `
  );
  res.json(rows);
});

app.listen(port);

import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const fileInput = useRef();

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: "1",
          }}
        >
          <img src={search} width="16" alt="search-icon" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              padding: "0.5rem",
              width: "100%",
            }}
          />
        </div>
        <Select
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
          style={{
            flex: "1",
            minWidth: "150px",
            width: "100%",
          }}
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>My Transactions</h2>
        <Radio.Group
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
          style={{
            marginBottom: "0.5rem",
          }}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={exportToCsv}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2970ff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Export to CSV
          </button>
          <label
            htmlFor="file-csv"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2970ff",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Import from CSV
          </label>
          <input
            onChange={importFromCsv}
            id="file-csv"
            type="file"
            accept=".csv"
            required
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
};

export default TransactionSearch;

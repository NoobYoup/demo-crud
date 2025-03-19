import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Button, Form, Container } from "react-bootstrap";

const API_URL = "https://67da60d035c87309f52c21ed.mockapi.io/api/v1/users";

export default function UserTable() {
  const queryClient = useQueryClient();
  const [userForm, setUserForm] = useState({ name: "", class: "", mssv: "" });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  // Create user
  const createUserMutation = useMutation({
    mutationFn: (newUser) => axios.post(API_URL, newUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) => axios.put(`${API_URL}/${updatedUser.id}`, updatedUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({ ...userForm, id: editingUser });
    } else {
      createUserMutation.mutate(userForm);
    }
    setUserForm({ name: "", class: "", mssv: "" });
    setEditingUser(null);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Container className="p-4">
      <h2 className="text-center mb-4">Table User Nhóm 20 Thứ 4 Ca 3</h2>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Class"
            value={userForm.class}
            onChange={(e) => setUserForm({ ...userForm, class: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="MSSV"
            value={userForm.mssv}
            onChange={(e) => setUserForm({ ...userForm, mssv: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          {editingUser ? "Update" : "Create"}
        </Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>MSSV</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.class}</td>
              <td>{user.mssv}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setUserForm({ name: user.name, class: user.class, mssv: user.mssv });
                    setEditingUser(user.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteUserMutation.mutate(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

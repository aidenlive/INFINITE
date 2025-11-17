# API Documentation

Base URL: `http://localhost:3001/api`

## 📋 Table of Contents
- [Health Check](#health-check)
- [Cards API](#cards-api)
- [Canvas API](#canvas-api)
- [Upload API](#upload-api)
- [Error Handling](#error-handling)

---

## 🏥 Health Check

### GET /api/health

Check if the API server is running.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎴 Cards API

### Get All Cards

**GET** `/api/cards`

Retrieve all cards.

**Response**
```json
[
  {
    "id": "uuid",
    "type": "text",
    "positionX": 100,
    "positionY": 200,
    "width": 300,
    "height": 200,
    "content": "Hello world",
    "metadata": {},
    "zIndex": 0,
    "groupId": null,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### Get Card by ID

**GET** `/api/cards/:id`

Retrieve a single card by ID.

**Response**
```json
{
  "id": "uuid",
  "type": "markdown",
  "positionX": 500,
  "positionY": 300,
  "width": 400,
  "height": 300,
  "content": "# Hello\n\nMarkdown content",
  "metadata": {
    "filename": "notes.md"
  },
  "zIndex": 1,
  "groupId": null,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Create Card

**POST** `/api/cards`

Create a new card.

**Request Body**
```json
{
  "type": "text",
  "position": {
    "x": 100,
    "y": 200
  },
  "size": {
    "width": 300,
    "height": 200
  },
  "content": "Card content",
  "metadata": {
    "title": "My Card"
  }
}
```

**Card Types**
- `text` - Plain text card
- `markdown` - Markdown document
- `code` - Code snippet
- `image` - Image display
- `sticky` - Sticky note
- `url` - URL embed
- `file` - Generic file

**Response** (201 Created)
```json
{
  "id": "new-uuid",
  "type": "text",
  "positionX": 100,
  "positionY": 200,
  "width": 300,
  "height": 200,
  "content": "Card content",
  "metadata": {
    "title": "My Card"
  },
  "zIndex": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Card

**PUT** `/api/cards/:id`

Update an existing card. All fields are optional.

**Request Body**
```json
{
  "type": "markdown",
  "position": {
    "x": 150,
    "y": 250
  },
  "size": {
    "width": 350,
    "height": 250
  },
  "content": "Updated content",
  "metadata": {
    "title": "Updated Title"
  },
  "zIndex": 5,
  "groupId": "group-uuid"
}
```

**Response**
```json
{
  "id": "uuid",
  "type": "markdown",
  "positionX": 150,
  "positionY": 250,
  "width": 350,
  "height": 250,
  "content": "Updated content",
  "metadata": {
    "title": "Updated Title"
  },
  "zIndex": 5,
  "groupId": "group-uuid",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Delete Card

**DELETE** `/api/cards/:id`

Delete a card by ID.

**Response** (204 No Content)

---

## 🖼️ Canvas API

### Get All Canvases

**GET** `/api/canvases`

Retrieve all saved canvases.

**Response**
```json
[
  {
    "id": "uuid",
    "name": "My Project",
    "data": {
      "cards": [...],
      "groups": [...],
      "viewport": {...}
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### Get Canvas by ID

**GET** `/api/canvases/:id`

Retrieve a single canvas by ID.

**Response**
```json
{
  "id": "uuid",
  "name": "My Project",
  "data": {
    "cards": [
      {
        "id": "card-uuid",
        "type": "text",
        "position": { "x": 100, "y": 200 },
        "size": { "width": 300, "height": 200 },
        "content": "Hello",
        "metadata": {},
        "zIndex": 0,
        "createdAt": 1705315200000,
        "updatedAt": 1705315200000
      }
    ],
    "groups": [],
    "viewport": {
      "x": 0,
      "y": 0,
      "zoom": 1
    }
  },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Create Canvas

**POST** `/api/canvases`

Save a canvas snapshot.

**Request Body**
```json
{
  "name": "My Project",
  "data": {
    "cards": [...],
    "groups": [...],
    "viewport": {...}
  }
}
```

**Response** (201 Created)
```json
{
  "id": "new-uuid",
  "name": "My Project",
  "data": {...},
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Canvas

**PUT** `/api/canvases/:id`

Update a saved canvas.

**Request Body**
```json
{
  "name": "Updated Project Name",
  "data": {
    "cards": [...],
    "groups": [...],
    "viewport": {...}
  }
}
```

**Response**
```json
{
  "id": "uuid",
  "name": "Updated Project Name",
  "data": {...},
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Delete Canvas

**DELETE** `/api/canvases/:id`

Delete a saved canvas.

**Response** (204 No Content)

---

## 📤 Upload API

### Upload File

**POST** `/api/upload`

Upload an image or file.

**Request**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Max size: 10MB

**Supported file types:**
- Images: `jpeg`, `jpg`, `png`, `gif`, `svg`
- Documents: `pdf`, `txt`, `md`, `csv`, `html`

**Example (using FormData)**
```javascript
const formData = new FormData();
formData.append('file', fileBlob);

fetch('http://localhost:3001/api/upload', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response**
```json
{
  "success": true,
  "file": {
    "filename": "image.jpg",
    "url": "/uploads/1705315200000-123456789.jpg",
    "mimetype": "image/jpeg",
    "size": 245678
  }
}
```

**Error Response** (400)
```json
{
  "error": "No file uploaded"
}
```

---

## ⚠️ Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (in development mode)"
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content (successful deletion) |
| `400` | Bad Request (validation error) |
| `404` | Not Found |
| `500` | Internal Server Error |

### Validation Errors

When using Zod validation, errors include detailed information:

```json
{
  "error": "Validation error",
  "details": "Invalid type: expected string, received number at path 'content'"
}
```

---

## 🔒 Security

### CORS
CORS is enabled for `http://localhost:5173` by default. Update `CLIENT_URL` in `.env` for production.

### Rate Limiting
Not currently implemented. Consider adding rate limiting for production use.

### File Upload Security
- File type validation
- Size limits (10MB)
- Sanitized filenames
- Stored outside web root

---

## 📊 Examples

### Complete Workflow Example

```javascript
// 1. Create a text card
const createResponse = await fetch('http://localhost:3001/api/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'text',
    position: { x: 100, y: 100 },
    size: { width: 300, height: 200 },
    content: 'Hello World'
  })
});
const card = await createResponse.json();

// 2. Update the card
await fetch(`http://localhost:3001/api/cards/${card.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Updated content',
    position: { x: 150, y: 150 }
  })
});

// 3. Save canvas
await fetch('http://localhost:3001/api/canvases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Canvas',
    data: {
      cards: [card],
      groups: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    }
  })
});

// 4. Upload image
const formData = new FormData();
formData.append('file', imageFile);

const uploadResponse = await fetch('http://localhost:3001/api/upload', {
  method: 'POST',
  body: formData
});
const { file } = await uploadResponse.json();

// 5. Create image card with uploaded file
await fetch('http://localhost:3001/api/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'image',
    position: { x: 500, y: 100 },
    size: { width: 400, height: 300 },
    content: file.url,
    metadata: { filename: file.filename }
  })
});
```

---

## 🔄 Integration with Frontend

The frontend uses the Canvas Store which can be extended to sync with the backend:

```typescript
// Example: Sync card creation to backend
const addCard = async (type: CardType, position: Position, content?: string) => {
  const card = useCanvasStore.getState().addCard(type, position, content);
  
  // Optional: sync to backend
  await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: card.type,
      position: card.position,
      size: card.size,
      content: card.content,
      metadata: card.metadata
    })
  });
  
  return card;
};
```

---

<div align="center">

[⬆ Back to Top](#api-documentation)

</div>

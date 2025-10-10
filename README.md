# Skrivee Backend Assignment

A Node.js/TypeScript backend application for managing author rankings based on various metrics. This project implements a sophisticated ranking system that evaluates authors based on their fans, favorites, content creation, and profile completeness.

## 🚀 Features

- **Author Management**: Add and update author information
- **Dynamic Ranking System**: Real-time calculation of author rankings based on multiple metrics
- **RESTful API**: Clean API endpoints for all operations
- **Data Validation**: Input validation using Zod schemas
- **Database Integration**: MongoDB with Prisma ORM
- **Testing**: Comprehensive test suite for ranking logic

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest
- **Build Tool**: TypeScript Compiler

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajeetk7ev/Skrivee-backend-assignment.git
   cd Skrivee-backend-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_mongodb_connection_string"
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/authors` | Add a new author |
| PUT | `/authors/:id` | Update an existing author |
| GET | `/rankings` | Get all authors with their rankings |

### Request/Response Examples

#### Add Author
```bash
POST /api/authors
Content-Type: application/json

{
  "name": "John Doe",
  "total_fans": 150,
  "total_faves": 120,
  "total_skrivees": 25,
  "total_skrivees_read": 300,
  "profile_completeness": 95
}
```

#### Update Author
```bash
PUT /api/authors/{author_id}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "total_fans": 200,
  "total_faves": 150,
  "total_skrivees": 30,
  "total_skrivees_read": 400,
  "profile_completeness": 98
}
```

#### Get Rankings
```bash
GET /api/rankings
```

Response:
```json
[
  {
    "id": "author_id",
    "name": "John Doe",
    "total_fans": 200,
    "total_faves": 150,
    "total_skrivees": 30,
    "total_skrivees_read": 400,
    "profile_completeness": 98,
    "score": 87.5,
    "rank": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🏆 Ranking Algorithm Explained

The ranking system uses a sophisticated weighted scoring algorithm that considers multiple factors to determine an author's overall performance and ranking.

### Scoring Components

The algorithm evaluates authors based on five key metrics:

1. **Total Fans (40% weight)** - Number of followers/fans
2. **Total Favorites (25% weight)** - Number of content pieces favorited
3. **Total Skrivees (15% weight)** - Number of content pieces created
4. **Total Skrivees Read (10% weight)** - Number of content pieces read
5. **Profile Completeness (10% weight)** - Percentage of profile completion (0-100%)

### Algorithm Steps

#### 1. Normalization
Each metric is normalized to a 0-1 scale by dividing by the maximum value in the dataset:
```typescript
const normalizedFans = author.total_fans / maxFans;
const normalizedFaves = author.total_faves / maxFaves;
const normalizedSkrivees = author.total_skrivees / maxSkrivees;
const normalizedReads = author.total_skrivees_read / maxReads;
const normalizedProfile = author.profile_completeness / 100;
```

#### 2. Weighted Scoring
The final score is calculated using weighted averages:
```typescript
const score = (
  normalizedFans * 0.4 +
  normalizedFaves * 0.25 +
  normalizedSkrivees * 0.15 +
  normalizedReads * 0.1 +
  normalizedProfile * 0.1
) * 100;
```

#### 3. Ranking Assignment
Authors are sorted by their calculated scores in descending order, and ranks are assigned sequentially (1, 2, 3, etc.).

### Why This Algorithm?

- **Balanced Evaluation**: No single metric dominates the ranking
- **Scalable**: Works with any number of authors
- **Fair**: Normalization ensures authors with lower absolute numbers can still compete
- **Transparent**: Clear weights make the system understandable
- **Dynamic**: Rankings update automatically when data changes

### Example Calculation

Consider two authors:

**Author A:**
- Fans: 100, Faves: 80, Skrivees: 20, Reads: 200, Profile: 90%

**Author B:**
- Fans: 200, Faves: 60, Skrivees: 10, Reads: 150, Profile: 95%

Assuming these are the maximum values in the dataset:

**Author A Score:**
- Normalized: (1.0×0.4) + (1.0×0.25) + (1.0×0.15) + (1.0×0.1) + (0.9×0.1) = 0.99
- Final Score: 99

**Author B Score:**
- Normalized: (1.0×0.4) + (0.75×0.25) + (0.5×0.15) + (0.75×0.1) + (0.95×0.1) = 0.8575
- Final Score: 85.75

Author A would rank higher despite having fewer fans because of their superior performance in other metrics.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The test suite includes:
- Empty dataset handling
- Multiple author ranking calculations
- Equal score handling
- Edge cases (zero values, normalization)

## 📁 Project Structure

```
src/
├── config/
│   └── prisma.ts          # Database configuration
├── controllers/
│   └── author.controller.ts # API route handlers
├── routes/
│   └── author.route.ts    # Route definitions
├── utils/
│   └── rankCalculator.ts  # Ranking algorithm implementation
├── validators/
│   └── author.schema.ts   # Input validation schemas
├── tests/
│   └── rankCalculator.test.ts # Test suite
└── server.ts              # Application entry point
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite

### Database Schema

The `Author` model includes:
- Basic information (id, name)
- Metrics (fans, faves, skrivees, reads, profile completeness)
- Calculated fields (score, rank)
- Timestamps (createdAt, updatedAt)


# Quan Ly Chi Tieu - Expense Tracker

Ung dung web quan ly chi tieu ca nhan, ho tro thong ke bieu do va phan quyen User/Admin.

## Cong nghe

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Recharts
- **Backend:** Spring Boot 3.4 + Spring Security + JPA/Hibernate
- **Database:** H2 (dev) / PostgreSQL (production)

## Yeu cau

- **Node.js** >= 18
- **Java** >= 21 (JDK) - Project su dung Spring Boot 3.4

## Cach chay project

### 1. Backend

```bash
cd server
./start.sh
```

> Script `start.sh` tu dong tim `JAVA_HOME` neu ban chua thiet lap, va tu dong kill process dang chiem port 8080.  
> Neu gap loi "Java not found", hay cai JDK 21+ va dam bao `java` nam trong PATH.

**Hoac chay thu cong (neu da biet JAVA_HOME):**

```bash
cd server
export JAVA_HOME=/path/to/your/jdk-21
./mvnw spring-boot:run
```

Backend se chay tai `http://localhost:8080`

- **H2 Console** (xem du lieu): `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:expense_db`
  - User: `sa`
  - Password: (de trong)

### 2. Frontend

Mo terminal khac:

```bash
cd client
npm install       # chi can chay lan dau
npm run dev
```

Frontend se chay tai `http://localhost:5173`

## Cau truc thu muc

```
expense-tracker/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/        # Axios config
│   │   ├── components/ # Layout, Navbar, ProtectedRoute
│   │   ├── context/    # AuthContext
│   │   └── pages/      # Login, Register, Dashboard, Reports, Admin, Profile
│   └── ...
├── server/          # Spring Boot backend
│   ├── src/main/java/com/milo/server/
│   │   ├── config/     # SecurityConfig, CORS, DataSeeder
│   │   ├── controller/ # Auth, Transaction, Report, Admin
│   │   ├── entity/     # User, Transaction, Category
│   │   ├── repository/ # JPA Repositories
│   │   └── service/    # Business logic
│   └── ...
└── srs.txt          # Yeu cau he thong
```

## Chuyen sang PostgreSQL (Production)

Sua file `server/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## Lich su sua doi chinh

- **Fix auth 401/403:** Doi tu httpBasic sang session-based auth + cau hinh CORS dung cach + xoa `@CrossOrigin("*")` xung dot voi `withCredentials`.
- **Fix password mismatch:** Bo prefix `{noop}` trong `CustomUserDetailsService` de `NoOpPasswordEncoder` so sanh dung.
- **Fix NaN / "Khong xac dinh" tren Dashboard:** Them `@JsonIgnore` vao `User.transactions` de break vong lap Jackson serialize (User <-> Transaction).
- **Fix Monthly Report 500:** Doi native SQL sang JPQL (`month()`, `year()` HQL functions) + tra ve `List<Object[]>` roi convert sang Map trong controller.
- **Auto-seed categories:** `DataSeeder` tu dong them 10 danh muc mac dinh vao H2 khi start.

// ===============================================
// RELACIONAMENTO COM USER
// ===============================================
//
// Todo relacionamento 1:1 ou 1:N no Prisma geralmente possui
// DOIS CAMPOS:
//
// 1) Campo de relacionamento (virtual)
// ------------------------------------
// user User @relation(fields: [user_id], references: [id])
//
// - NÃO existe como coluna no banco de dados.
// - Existe apenas no Prisma para representar o relacionamento.
// - Permite acessar o objeto completo do usuário.
//
// Exemplo:
//
// const checkIn = await prisma.checkIn.findUnique({
//   include: {
//     user: true,
//   },
// })
//
// checkIn.user.name
// checkIn.user.email
//
// O Prisma usa esse campo para saber:
// - com qual model ele se relaciona (User);
// - qual campo guarda a FK (user_id);
// - qual campo da outra tabela é referenciado (User.id).
//
//
// 2) Campo da chave estrangeira (real)
// ------------------------------------
// user_id String
//
// - Esse campo EXISTE no banco de dados.
// - É a Foreign Key (FK).
// - Guarda apenas o ID do usuário.
//
// Exemplo:
//
// id | user_id
// ---|---------
// C1 | abc123
//
// O Prisma pega o valor de user_id, procura um User cujo
// id seja igual a esse valor e monta automaticamente o
// objeto "user" quando usamos include ou select.
//
// Resumindo:
//
// user    -> Campo virtual do Prisma (não vai para o banco).
// user_id -> Coluna real da tabela (Foreign Key).

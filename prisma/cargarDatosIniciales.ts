import { prisma } from "../src/lib/prisma";

async function main() {

    //Limpio los datos iniciales si es que existen
    await prisma.producto.deleteMany();
    await prisma.categoria.deleteMany();
    

    //creo categorias
    const mates = await prisma.categoria.create({
        data: {
            nombre:'Mates',
            descripcion: 'Mates artesanales de algarrobo y calabaza',
        }
    });

    const cuadros = await prisma.categoria.create({
        data:{
            nombre: 'Cuadros',
            descripcion: 'Cuadros de madera hechos a mano'
        }
    });

    // Crear productos de prueba
    await prisma.producto.create({
        data: {
            nombre: 'Mate Imperial de Calabaza',
            descripcion: 'Mate de calabaza seleccionada con virola de alpaca cincelada.',
            precio: 25000.00,
            stock: 10,
            permitePersonalizacion: true,
            categoriaId: mates.id,
            fotos:{
                create: [
                    {
                        url:'https://d22fxaf9t8d39k.cloudfront.net/ee06090a8cf2776a4e3d01b66989245ff4d144f90a35999ed3af1aff1507963719762.jpg',
                        orden: 1,
                        esPrincipal: true,
                    }
                ]
            }
        }
    });

    await prisma.producto.create({
        data: {
            nombre: 'Mate Ranchero',
            descripcion: 'Mate de algarrobo ranchero.',
            precio: 18000.00,
            stock: 15,
            permitePersonalizacion: true,
            categoriaId: mates.id,
            fotos:{
                create: [
                    {
                        url:'https://acdn-us.mitiendanube.com/stores/064/781/products/img_0746-f7ff14ed42ad2b93a617727210978831-1024-1024.jpeg',
                        orden: 1,
                        esPrincipal: true,
                    }
                ]
            }
        }
    });

    await prisma.producto.create({
        data: {
            nombre: 'Cuadro Jesús',
            descripcion: 'Pintura al óleo sobre cuadro de fibrofacil de 60x40 cm.',
            precio: 45000.00,
            stock: 3,
            permitePersonalizacion: false,
            categoriaId: cuadros.id,
            fotos:{
                create: [
                    {
                        url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX6PTCQT3DOUGV5KoK2xFMGSYeCNimVhkkpIOkqszcmw&s=10',
                        orden: 1,
                        esPrincipal: true,
                    }
                ]
            }
        }
    });
  
}

main()
    .catch((e) => {
        console.error('Error al ejecutar la carga de datos inicial');
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
<?php

namespace App\Controller;

use App\Entity\RapportVeterinaire;
use App\Repository\RapportVeterinaireRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use DateTimeImmutable;

#[Route('api/rapportVeterinaire', name: 'app_api_rapportVeterinaire_')]
class RapportVeterinaireController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $manager,
        private RapportVeterinaireRepository $repository,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator
    ) {
    }

    #[Route(methods: 'POST')]
    public function new(Request $request): JsonResponse
    {
        $rapportVeterinaire = $this->serializer->deserialize(
            $request->getContent(),
            RapportVeterinaire::class,
            'json'
        );
     

        // Tell Doctrine you want to (eventually) save the rapportVeterinaire (no queries yet)
        $this->manager->persist($rapportVeterinaire);
        // Actually executes the queries (i.e. the INSERT query)
        $this->manager->flush();

        $responseData = $this->serializer->serialize($rapportVeterinaire, 'json');
        $location = $this->urlGenerator->generate(
            'app_api_rapportVeterinaire_show',
            ['id' => $rapportVeterinaire->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
        return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
    }

    #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
    {
        $rapportVeterinaire = $this->repository->findOneBy(['id' => $id]);

        if (!$rapportVeterinaire) {
            return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
        }

        $responseData = $this->serializer->serialize($rapportVeterinaire, 'json');
        return new JsonResponse(data: $responseData, status: Response::HTTP_OK, json: true);
    }

    #[Route('/{id}', name: 'edit', methods: 'PUT')]
    public function edit(int $id): JsonResponse
    {
        $rapportVeterinaire = $this->repository->findOneBy(['id' => $id]);
        if (!$rapportVeterinaire) {
            $this->manager->flush();
            return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
    }

    #[Route('/{id}', name: 'delete', methods: 'DELETE')]
    public function delete(int $id): JsonResponse
    {
        $rapportVeterinaire = $this->repository->findOneBy(['id' => $id]);
        if (!$rapportVeterinaire) {
            return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
        }

        $this->manager->remove($rapportVeterinaire);
        $this->manager->flush();

        return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
    }
}


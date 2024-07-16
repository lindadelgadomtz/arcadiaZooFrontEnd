<?php

namespace App\Controller;

use App\Entity\Role;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;



#[Route('api/role', name:'app_api_role_')]
class RoleController extends AbstractController

{
    public function __construct(
        private EntityManagerInterface $manager, 
        private RoleRepository $repository,
        private SerializerInterface $serializer,
        private UrlGeneratorInterface $urlGenerator,
        )
    {
    }
  #[Route(methods: 'POST')]
  public function new(Request $request): JsonResponse
  {
      $role = $this->serializer->deserialize(
          $request->getContent(),
          Role::class,
          'json'
      );
     

      // Tell Doctrine you want to (eventually) save the role (no queries yet) 
      $this->manager->persist($role);
      // Actually executes the queries (i.e. the INSERT query)
      $this->manager->flush();

      $responseData = $this->serializer->serialize($role, 'json');
      $location = $this->urlGenerator->generate(
          'app_api_role_show',
          ['id' => $role->getId()],
          UrlGeneratorInterface::ABSOLUTE_URL
      );
      return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
  }


   #[Route('/{id}', name: 'show', methods: 'GET')]
   public function show(int $id): JsonResponse
   {
       $role = $this->repository->findOneBy(['id' => $id]);

       if (!$role) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $responseData = $this->serializer->serialize($role, 'json');
       return new JsonResponse(data: $responseData, status: Response::HTTP_OK, json: true);
   }

   #[Route('/{id}', name: 'edit', methods: 'PUT')]
   public function edit(int $id): JsonResponse
   {
       $role = $this->repository->findOneBy(['id' => $id]);
       if (!$role) {
           $this->manager->flush();
           return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
       }

       return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
   }

   #[Route('/{id}', name: 'delete', methods: 'DELETE')]
   public function delete(int $id): JsonResponse
   {
       $role = $this->repository->findOneBy(['id' => $id]);
       if (!$role) {
           return new JsonResponse(data: null, status: Response::HTTP_NOT_FOUND);
       }

       $this->manager->remove($role);
       $this->manager->flush();

       return new JsonResponse(data: null, status: Response::HTTP_NO_CONTENT);
   }
}